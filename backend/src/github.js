const axios = require('axios');
const pLimit = require('p-limit').default;

function parseGithubRepoUrl(inputUrl) {
  try {
    const url = new URL(inputUrl);
    if (url.hostname !== 'github.com') {
      throw new Error('Only github.com URLs are supported');
    }
    const parts = url.pathname.replace(/\.git$/, '').replace(/^\/+|\/+$/g, '').split('/');
    if (parts.length < 2) throw new Error('Invalid GitHub repo URL');
    const [owner, repo] = parts;
    return { owner, repo };
  } catch (e) {
    throw new Error('Invalid GitHub URL');
  }
}

function statusToShort(status) {
  switch (status) {
    case 'added': return 'A';
    case 'modified': return 'M';
    case 'removed': return 'D';
    case 'renamed': return 'R';
    case 'copied': return 'C';
    case 'changed': return 'M';
    default:
      return (status && status[0] ? status[0].toUpperCase() : 'M');
  }
}

function getAxiosHeaders(token) {
  const headers = { 'Accept': 'application/vnd.github+json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function listCommits({ owner, repo, token, maxCommits }) {
  const perPage = 100;
  const headers = getAxiosHeaders(token);
  const commits = [];
  let page = 1;

  while (true) {
    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits`,
      { params: { per_page: perPage, page }, headers }
    );

    if (!Array.isArray(data) || data.length === 0) break;

    commits.push(...data);

    if (maxCommits && commits.length >= maxCommits) {
      return commits.slice(0, maxCommits);
    }

    if (data.length < perPage) break;
    page += 1;
  }

  return commits;
}

async function getCommitDetails({ owner, repo, sha, token }) {
  const headers = getAxiosHeaders(token);
  const { data } = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`,
    { headers }
  );
  return data;
}

async function analyzeRepository(repoUrl, { token, maxCommits } = {}) {
  const { owner, repo } = parseGithubRepoUrl(repoUrl);
  const commits = await listCommits({ owner, repo, token, maxCommits });

  const limit = pLimit(6);
  const detailPromises = commits.map((c) => limit(() => getCommitDetails({ owner, repo, sha: c.sha, token })));
  const details = await Promise.all(detailPromises);

  const mapped = details.map((d) => {
    const dateIso = d.commit?.author?.date || d.commit?.committer?.date || new Date().toISOString();
    const date = dateIso.slice(0, 10);
    const message = (d.commit?.message || '').split('\n')[0];
    const authorName = d.commit?.author?.name || d.author?.login || 'Unknown';
    const files = Array.isArray(d.files) ? d.files : [];
    return {
      commit: (d.sha || '').slice(0, 7),
      fullSha: d.sha || '',
      author: authorName,
      date,
      timestamp: dateIso,
      message,
      htmlUrl: d.html_url || '',
      changes: files.map((f) => ({ status: statusToShort(f.status), file: f.filename })),
    };
  });

  mapped.sort((a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0));
  return mapped;
}

module.exports = { analyzeRepository, parseGithubRepoUrl };
