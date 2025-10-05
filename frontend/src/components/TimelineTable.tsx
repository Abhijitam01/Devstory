"use client";

import { CommitItem } from "@/lib/api";

type Props = {
  commits: CommitItem[];
};

const statusLabel: Record<string, string> = {
  A: "Added",
  M: "Modified",
  D: "Deleted",
  R: "Renamed",
  C: "Copied",
};

function getTypeTag(file: string): string {
  const lower = file.toLowerCase();
  if (lower.includes("/api/") || lower.includes("/routes/") || lower.endsWith(".ts") && lower.includes("server")) return "Backend";
  if (lower.includes("/app/") || lower.includes("/pages/") || lower.endsWith(".tsx") || lower.endsWith(".jsx")) return "Frontend";
  if (lower.includes("prisma/") || lower.endsWith("schema.prisma") || lower.endsWith(".sql")) return "Schema";
  if (lower.includes("dockerfile") || lower.endsWith(".yml") || lower.endsWith(".yaml")) return "Infra";
  return "Other";
}

export function TimelineTable({ commits }: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            <th className="py-2 pr-4">Date</th>
            <th className="py-2 pr-4">Author</th>
            <th className="py-2 pr-4">Commit</th>
            <th className="py-2 pr-4">Message</th>
            <th className="py-2 pr-4">Files Changed</th>
            <th className="py-2">Type</th>
          </tr>
        </thead>
        <tbody>
          {commits.map((c) => {
            const files = c.changes.map((f) => f.file);
            const types = Array.from(new Set(files.map(getTypeTag)));
            return (
              <tr key={`${c.timestamp ?? c.date}-${c.commit}-${c.message}`} className="border-b border-neutral-100 dark:border-neutral-900 align-top">
                <td className="py-2 pr-4 whitespace-nowrap" title={c.timestamp ?? c.date}>{c.date}</td>
                <td className="py-2 pr-4 whitespace-nowrap">{c.author}</td>
                <td className="py-2 pr-4 whitespace-nowrap">
                  {c.htmlUrl ? (
                    <a className="underline decoration-dotted underline-offset-2" href={c.htmlUrl} target="_blank" rel="noreferrer">
                      {c.commit}
                    </a>
                  ) : (
                    <span>{c.commit}</span>
                  )}
                </td>
                <td className="py-2 pr-4 max-w-[420px] truncate" title={c.message}>{c.message}</td>
                <td className="py-2 pr-4">
                  <ul className="space-y-1">
                    {c.changes.map((f, idx) => (
                      <li key={idx} className="text-neutral-700 dark:text-neutral-300">
                        <span className="mr-2 inline-block rounded px-1.5 py-0.5 text-[11px] bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                          {statusLabel[f.status] ?? f.status}
                        </span>
                        <code className="text-[11px] break-all">{f.file}</code>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-2">
                  <div className="flex flex-wrap gap-1">
                    {types.map((t) => (
                      <span key={t} className="inline-block rounded px-1.5 py-0.5 text-[11px] bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
