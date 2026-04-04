const fs = require("fs");
const path = require("path");

const GOOGLE_AUTH_PATH = path.join(__dirname, "..", "..", "google_auth.json");

// cachedConfig = undefined -> not loaded yet
// cachedConfig = null -> missing/invalid file
// cachedConfig = object -> ok
let cachedConfig;

// reads server/google_auth.json (Google Cloud OAuth client)
function readGoogleAuthConfig() {
  if (cachedConfig !== undefined) {
    return cachedConfig;
  }

  let raw;
  try {
    raw = fs.readFileSync(GOOGLE_AUTH_PATH, "utf8");
  } catch {
    cachedConfig = null;
    return null;
  }

  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    cachedConfig = null;
    return null;
  }

  const block = json.installed || json.web;
  if (!block || typeof block.client_id !== "string" || !block.client_id.trim()) {
    cachedConfig = null;
    return null;
  }

  cachedConfig = {
    clientId: block.client_id.trim(),
    tokenUri: typeof block.token_uri === "string" ? block.token_uri : null,
    authUri: typeof block.auth_uri === "string" ? block.auth_uri : null,
  };
  return cachedConfig;
}

// verifies that the access token was issued for OAuth client
async function verifyGoogleAccessTokenAudience(accessToken, expectedClientId) {
  const url = `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`;
  const res = await fetch(url);
  if (!res.ok) {
    return { ok: false, message: "Invalid or expired Google token" };
  }
  const info = await res.json();
  const aud = info.aud != null ? String(info.aud) : "";
  if (aud !== expectedClientId) {
    return { ok: false, message: "Google token is not valid for this application" };
  }
  return { ok: true, info };
}

module.exports = {
  readGoogleAuthConfig,
  verifyGoogleAccessTokenAudience,
  GOOGLE_AUTH_PATH,
};
