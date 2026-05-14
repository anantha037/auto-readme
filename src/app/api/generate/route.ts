import { NextResponse } from "next/server";
import { fetchRepoData } from "@/lib/github";
import { generateReadme } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 });
    }

    // 1. Fetch GitHub Data
    console.log(`[API] Fetching data for: ${url}`);
    const repoData = await fetchRepoData(url);
    
    console.log(`[API] Successfully fetched data for ${repoData.owner}/${repoData.repo}`);
    console.log(`[API] Critical files fetched: ${repoData.files.map(f => f.name).join(", ")}`);

    // 2. Generate README using Gemini AI
    console.log(`[API] Generating README via Gemini...`);
    const readmeMarkdown = await generateReadme(repoData);
    console.log(`[API] README generation complete.`);

    // 3. Return the generated markdown
    return NextResponse.json({ 
      success: true, 
      markdown: readmeMarkdown
    });

  } catch (error: any) {
    console.error("[API] Error processing request:", error.message);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" }, 
      { status: 500 }
    );
  }
}
