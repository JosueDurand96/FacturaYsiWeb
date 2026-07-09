// Next export genera `out/`. Render Static Site espera `dist/`.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const outDir = path.join(root, "out");
const distDir = path.join(root, "dist");

if (!fs.existsSync(outDir)) {
  console.error("[copy-static-to-dist] ERROR: no existe out/ — corre next build primero");
  process.exit(1);
}

fs.rmSync(distDir, { recursive: true, force: true });
fs.cpSync(outDir, distDir, { recursive: true });
console.log("[copy-static-to-dist] out/ → dist/ OK");
