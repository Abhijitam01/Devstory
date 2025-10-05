require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { analyzeRepository } = require('./github');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/analyze', async (req, res) => {
  try {
    const { url, maxCommits } = req.body || {};
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "url" in body' });
    }

    const limit = typeof maxCommits === 'number' ? maxCommits : undefined;
    const token = process.env.GITHUB_TOKEN || undefined;
    const data = await analyzeRepository(url, { token, maxCommits: limit });

    res.json({ repoUrl: url, count: data.length, commits: data });
  } catch (error) {
    const status = error.status || error.response?.status || 500;
    const message = error.message || 'Unexpected error';
    res.status(status).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`DevStory backend listening on port ${PORT}`);
});
