import { AnalyzeResponse, CommitItem } from '@devstory/shared';

/**
 * Exports commit data to CSV format
 */
export function exportToCSV(data: AnalyzeResponse): string {
  const headers = ['Commit', 'Author', 'Date', 'Message', 'Files Changed', 'File Names'];
  const rows = data.commits.map((commit) => [
    commit.commit,
    commit.author,
    commit.date,
    `"${commit.message.replace(/"/g, '""')}"`, // Escape quotes in CSV
    commit.changes.length.toString(),
    commit.changes.map((c) => c.file).join('; '),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Exports commit data to JSON format
 */
export function exportToJSON(data: AnalyzeResponse): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Downloads data as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports analysis data to CSV and downloads it
 */
export function exportAnalysisToCSV(data: AnalyzeResponse): void {
  const csv = exportToCSV(data);
  const repoName = data.repoUrl.replace('https://github.com/', '').replace('/', '-');
  const filename = `devstory-${repoName}-${new Date().toISOString().split('T')[0]}.csv`;
  downloadFile(csv, filename, 'text/csv');
}

/**
 * Exports analysis data to JSON and downloads it
 */
export function exportAnalysisToJSON(data: AnalyzeResponse): void {
  const json = exportToJSON(data);
  const repoName = data.repoUrl.replace('https://github.com/', '').replace('/', '-');
  const filename = `devstory-${repoName}-${new Date().toISOString().split('T')[0]}.json`;
  downloadFile(json, filename, 'application/json');
}

