// En Render Static Site, compila y copia out/ → dist/ cuando RENDER=true.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

if (process.env.RENDER !== "true") {
  process.exit(0);
}

const root = path.join(__dirname, "..");
const distIndex = path.join(root, "dist", "index.html");

if (fs.existsSync(distIndex)) {
  console.log("[postinstall] dist/index.html ya existe, omitiendo build");
  process.exit(0);
}

console.log("[postinstall] Render → compilando static export...");
execSync("npm run build", { stdio: "inherit", cwd: root });

if (!fs.existsSync(distIndex)) {
  console.error("[postinstall] ERROR: dist/index.html no se generó");
  process.exit(1);
}

console.log("[postinstall] Static export OK → dist/");
