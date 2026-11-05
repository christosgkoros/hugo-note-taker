const config = require('../config');

// Accept owner/repo, owner/repo.git or a full github.com URL
const REPO = (config.github_repo || "")
  .trim()
  .replace(/^(https?:\/\/)?github\.com\//, '')
  .replace(/\.git$/, '')
  .replace(/\/+$/, '');

const API = `https://api.github.com/repos/${REPO}/contents`;

function headers() {
  return {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${config.github_token}`,
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

async function getSha(path) {
  const response = await fetch(`${API}/${path}`, { headers: headers() });
  if (response.status === 404) {
    return undefined;
  }
  if (!response.ok) {
    throw new Error(`GitHub GET ${path} failed: ${response.status} ${await response.text()}`);
  }
  return (await response.json()).sha;
}

// Creates or updates a file in the repo as a single commit
async function commitFile(path, content, message) {
  const body = {
    message: message,
    content: Buffer.from(content).toString('base64')
  };

  // Updating an existing file requires its current blob sha
  const sha = await getSha(path);
  if (sha) {
    body.sha = sha;
  }

  if (config.git_name && config.git_email) {
    body.committer = { name: config.git_name, email: config.git_email };
  }

  const response = await fetch(`${API}/${path}`, {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(`GitHub PUT ${path} failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

module.exports = { commitFile };
