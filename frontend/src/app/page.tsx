"use client";

import { useState } from "react";
import { analyzeRepo, type AnalyzeResponse } from "@/lib/api";
import { TimelineTable } from "@/components/TimelineTable";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [maxCommits, setMaxCommits] = useState<number | undefined>(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyzeResponse | null>(null);

  async function onAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await analyzeRepo(repoUrl, maxCommits);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze repo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-6 sm:p-10 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">DevStory</h1>
        <p className="text-neutral-600 dark:text-neutral-300">See how a project was built — step by step.</p>
      </header>

      <form onSubmit={onAnalyze} className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="block text-sm mb-1">GitHub repository URL</label>
          <input
            type="url"
            required
            placeholder="https://github.com/user/repo"
            className="w-full rounded border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="block text-sm mb-1">Max commits (optional)</label>
          <input
            type="number"
            min={1}
            max={1000}
            className="w-full rounded border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2"
            value={maxCommits ?? 0}
            onChange={(e) => setMaxCommits(e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="h-10 sm:h-[42px] px-4 rounded bg-black text-white dark:bg-white dark:text-black disabled:opacity-60"
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </form>

      {error && (
        <div className="mb-4 rounded border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300 px-3 py-2">
          {error}
        </div>
      )}

      {data && (
        <section>
          <div className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
            <span className="font-medium">Repo:</span> {data.repoUrl} · <span className="font-medium">Commits:</span> {data.count}
          </div>
          <TimelineTable commits={data.commits} />
        </section>
      )}
    </div>
  );
}
