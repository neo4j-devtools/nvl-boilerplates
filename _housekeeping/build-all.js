const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const folders = ["angular", "nextjs", "plain", "react"];

function runCommands(folder, isTS) {
  console.log(`Running commands in ${folder}`);
  execSync("npm install", { stdio: "inherit", cwd: folder });
  const isAngular = fs.existsSync(path.join(folder, "angular.json"));
  if (isTS && !isAngular) {
    execSync("npx tsc", { stdio: "inherit", cwd: folder });
  }
  execSync("npm run build", { stdio: "inherit", cwd: folder });
}

function processFolder(folderPath) {
  if (fs.existsSync(path.join(folderPath, "package.json"))) {
    const isTS = fs.existsSync(path.join(folderPath, "tsconfig.json"));
    runCommands(folderPath, isTS);
    return;
  }

  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    if (item.startsWith(".") || item === "node_modules" || item === "dist") {
      continue;
    }
    const itemPath = path.join(folderPath, item);
    if (fs.statSync(itemPath).isDirectory()) {
      processFolder(itemPath);
    }
  }
}

folders.forEach((folder) => {
  processFolder(path.join(__dirname, "..", folder));
});