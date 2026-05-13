"use client";

import React, { useState } from "react";
import { Github, Sparkles, Terminal, Loader2 } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugData, setDebugData] = useState<any>(null); // Temp for Phase 2

  const handleGenerate = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    setDebugData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch repository data");
      }

      // In Phase 2, we just store the returned JSON for visualization
      setDebugData(data.data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-4xl w-full space-y-8 text-center">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-zinc-900 rounded-full mb-4 border border-zinc-800">
            <Terminal className="w-8 h-8 text-zinc-400" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
            Auto-<span className="text-zinc-400">README</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Generate professional, structured README.md files for your GitHub repositories in seconds using AI.
          </p>
        </div>

        {/* Input Form Shell */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-4 text-left">
          <label htmlFor="repo-url" className="block text-sm font-medium text-zinc-300">
            GitHub Repository URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Github className="h-5 w-5 text-zinc-500" />
              </div>
              <input
                type="url"
                id="repo-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                className="block w-full pl-10 pr-3 py-3 border border-zinc-700 rounded-lg leading-5 bg-zinc-950 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm transition-colors"
                placeholder="https://github.com/owner/repo"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !url}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-zinc-950 bg-zinc-100 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {loading ? "Fetching Data..." : "Generate"}
            </button>
          </div>
          
          {error && (
            <div className="mt-2 text-sm text-red-400 bg-red-950/50 border border-red-900/50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Temporary Phase 2 Debug Output */}
          {debugData && (
            <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-sm font-medium text-zinc-400">Phase 2 Check - Fetched Data:</h3>
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-xs text-emerald-400">
                  {JSON.stringify({
                    owner: debugData.owner,
                    repo: debugData.repo,
                    total_root_items: debugData.tree.length,
                    critical_files_fetched: debugData.files.map((f: any) => f.name)
                  }, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
