/**
 * Minimal GitHub Contents API helpers.
 *
 * SECURITY: These functions require a Personal Access Token (PAT).
 * - Use a Fine-grained PAT scoped to only this repository with "Contents: Read & write".
 * - Never expose these env vars in a publicly deployed bundle.
 *   Intended for local admin use (npm start) or behind an authenticated admin route.
 */

const API = "https://api.github.com";

/**
 * btoa() does not handle multi-byte (Unicode) characters directly.
 * This wrapper encodes the string as UTF-8 bytes before base64-ing.
 */
function utf8ToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

/**
 * Fetch a file's metadata (content + SHA) from the GitHub Contents API.
 * The SHA is required when updating an existing file.
 */
export async function getGitHubFile({ token, owner, repo, path, branch = "main" }) {
  const res = await fetch(
    `${API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `GitHub API error: ${res.status}`);
  }

  return res.json(); // { sha, content, path, ... }
}

/**
 * Create or update a file in the repository via a single commit.
 * `sha` is the current blob SHA — required when updating an existing file.
 */
export async function commitGitHubFile({
  token,
  owner,
  repo,
  path,
  branch = "main",
  content,
  sha,
  message,
}) {
  const res = await fetch(`${API}/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: utf8ToBase64(content),
      sha,
      branch,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `GitHub commit failed: ${res.status}`);
  }

  return res.json(); // { commit: { sha, html_url }, ... }
}
