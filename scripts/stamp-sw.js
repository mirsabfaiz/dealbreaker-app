// Post-build: rewrite the placeholder __BUILD_VERSION__ inside the
// already-copied dist/sw.js to include package.json version + a short
// timestamp. This guarantees a new cache key per release without manual
// editing of sw.js.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const pkg = JSON.parse(readFileSync(resolve("package.json"), "utf8"));
const version = `${pkg.version}-${Date.now().toString(36)}`;
const swPath = resolve("dist", "sw.js");

let sw;
try { sw = readFileSync(swPath, "utf8"); }
catch { console.error("[stamp-sw] dist/sw.js not found — did vite build run?"); process.exit(1); }

const stamped = sw.replace(/__BUILD_VERSION__/g, version);
writeFileSync(swPath, stamped);
console.log(`[stamp-sw] dist/sw.js cache key set to dealbreaker-${version}`);
