import { NextResponse } from "next/server";
import { fetchRepoData } from "@/lib/github";

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
    
    // Server-side logging for verification as requested
    console.log(`[API] Successfully fetched data for ${repoData.owner}/${repoData.repo}`);
    console.log(`[API] Root tree elements: ${repoData.tree.length}`);
    console.log(`[API] Critical files fetched: ${repoData.files.map(f => f.name).join(", ")}`);

    // 2. Return the fetched data (Temporary for Phase 2 testing)
    // Note: In Phase 3, we will pass this to Gemini instead of returning it.
    return NextResponse.json({ 
      success: true, 
      message: "Successfully fetched repository data",
      data: repoData 
    });

  } catch (error: any) {
    console.error("[API] Error processing request:", error.message);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" }, 
      { status: 500 }
    );
  }
}
