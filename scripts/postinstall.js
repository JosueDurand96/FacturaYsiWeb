// Render Build Command por defecto = solo `npm install`.
// Instala devDependencies y compila cuando RENDER=true.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

if (process.env.RENDER !== "true") {
  process.exit(0);
}

const root = path.join(__dirname, "..");
const buildId = path.join(root, ".next", "BUILD_ID");

if (fs.existsSync(buildId)) {
  console.log("[postinstall] .next/BUILD_ID ya existe, omitiendo build");
  process.exit(0);
}

console.log("[postinstall] Render → instalando devDependencies y compilando...");
execSync("npm install --include=dev --ignore-scripts", {
  stdio: "inherit",
  cwd: root,
});
execSync("npm run build", { stdio: "inherit", cwd: root });

if (!fs.existsSync(buildId)) {
  console.error("[postinstall] ERROR: next build no generó .next/BUILD_ID");
  process.exit(1);
}

console.log("[postinstall] Build OK");
