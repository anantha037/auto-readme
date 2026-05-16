export interface GitHubFile {
  name: string;
  path: string;
  content: string;
}

export interface RepoData {
  owner: string;
  repo: string;
  tree: string[]; // List of file/folder names in the root
  files: GitHubFile[]; // Up to 5 fetched files
}

// Helper to extract owner and repo from a URL
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== "github.com") return null;

    const parts = parsedUrl.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;

    return { owner: parts[0], repo: parts[1] };
  } catch {
    return null;
  }
}

const CRITICAL_FILES = [
  "readme.md",
  "package.json",
  "requirements.txt",
  "go.mod",
  "cargo.toml",
  "gemfile",
  "composer.json",
  "index.js",
  "index.ts",
  "main.py",
  "app.py",
  "main.go",
  "src/index.ts",
  "src/index.js",
  "src/main.rs",
];

// Fetch raw file content
async function fetchFileContent(downloadUrl: string): Promise<string | null> {
  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    console.error("Error fetching file content:", error);
    return null;
  }
}

export async function fetchRepoData(url: string): Promise<RepoData> {
  const parsed = parseGitHubUrl(url);
  if (!parsed) {
    throw new Error("Invalid GitHub URL");
  }

  const { owner, repo } = parsed;

  // Fetch root directory contents
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
  const response = await fetch(apiUrl, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      // Optional: Add authorization header here if you add a PAT to bypass rate limits later
    },
  });

  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      throw new Error("GitHub API Rate limit exceeded. Please try again later.");
    }
    if (response.status === 404) {
      throw new Error("Repository not found or is private.");
    }
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const contents = await response.json();
  
  if (!Array.isArray(contents)) {
    throw new Error("Unexpected response from GitHub API");
  }

  interface GitHubItem {
    type: string;
    name: string;
    path: string;
    download_url: string | null;
  }

  // Extract root directory structure (just names to give the LLM context of what's inside)
  const tree = contents.map((item: GitHubItem) => `${item.type === "dir" ? "📁" : "📄"} ${item.name}`);

  // Find up to 5 critical files
  const filesToFetch = contents
    .filter((item: GitHubItem) => item.type === "file")
    .filter((item: GitHubItem) => CRITICAL_FILES.includes(item.name.toLowerCase()))
    .slice(0, 5);

  const fetchedFiles: GitHubFile[] = [];

  for (const file of filesToFetch) {
    if (file.download_url) {
      const content = await fetchFileContent(file.download_url);
      if (content) {
        fetchedFiles.push({
          name: file.name,
          path: file.path,
          content,
        });
      }
    }
  }

  return {
    owner,
    repo,
    tree,
    files: fetchedFiles,
  };
}
