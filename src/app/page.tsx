"use client";

import React, { useState } from "react";
import { GitBranch, Sparkles, Terminal, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    setMarkdown(null);

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
        throw new Error(data.error || "Failed to generate README");
      }

      setMarkdown(data.markdown);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-6 sm:p-12">
      <div className={`max-w-4xl w-full space-y-8 text-center transition-all duration-500 ${markdown ? 'mt-8' : ''}`}>
        
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
                <GitBranch className="h-5 w-5 text-zinc-500" />
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
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
          
          {error && (
            <div className="mt-2 text-sm text-red-400 bg-red-950/50 border border-red-900/50 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Markdown Preview */}
        {markdown && (
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-2xl text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-emerald-400" />
              Generated README.md
            </h3>
            <div className="prose prose-invert max-w-none prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-headings:text-zinc-100 prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-strong:text-zinc-100">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
