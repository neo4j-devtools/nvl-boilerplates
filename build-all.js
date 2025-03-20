const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const folders = ["plain", "react"];

function runCommands(folder, isTS) {
  console.log(`Running commands in ${folder}`);
  execSync("npm install", { stdio: "inherit", cwd: folder });
  if (isTS) {
    execSync("npx tsc", { stdio: "inherit", cwd: folder });
  }
  execSync("npm run build", { stdio: "inherit", cwd: folder });
}

function processFolder(folderPath) {
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    const itemPath = path.join(folderPath, item);
    if (fs.statSync(itemPath).isDirectory()) {
      if (fs.existsSync(path.join(itemPath, "package.json"))) {
        const isTS = fs.existsSync(path.join(itemPath, "tsconfig.json"));
        runCommands(itemPath, isTS);
      } else {
        processFolder(itemPath);
      }
    }
  }
}

folders.forEach((folder) => {
  const folderPath = path.join(__dirname, folder);
  processFolder(folderPath);
});
