// optional script to automatically sync the oauth client_id from server/google_auth.json into extension/manifest.json
const fs = require("fs");
const path = require("path");

const serverRoot = path.join(__dirname, "..");
const authPath = path.join(serverRoot, "google_auth.json");
const manifestPath = path.join(serverRoot, "..", "extension", "manifest.json");

const raw = fs.readFileSync(authPath, "utf8");
const json = JSON.parse(raw);
const block = json.installed || json.web;
if (!block?.client_id) {
  console.error("google_auth.json must contain installed.client_id or web.client_id");
  process.exit(1);
}

const manifestRaw = fs.readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestRaw);
if (!manifest.oauth2) {
  manifest.oauth2 = {};
}
manifest.oauth2.client_id = block.client_id;
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log("Updated extension/manifest.json oauth2.client_id from google_auth.json");
