const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function upgradeDependencies(folder) {
  console.log(`Upgrading dependencies in ${folder}`);
  const packageJsonPath = path.join(folder, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  const upgradeDeps = (deps) => {
    for (const dep in deps) {
      if (dep.startsWith("@neo4j-nvl/")) {
        execSync(`npm install ${dep}@latest`, {
          stdio: "inherit",
          cwd: folder,
        });
      }
    }
  };

  upgradeDeps(dependencies);
  upgradeDeps(devDependencies);
}

function processFolder(folderPath) {
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    const itemPath = path.join(folderPath, item);
    if (fs.statSync(itemPath).isDirectory()) {
      if (fs.existsSync(path.join(itemPath, "package.json"))) {
        upgradeDependencies(itemPath);
      } else {
        processFolder(itemPath);
      }
    }
  }
}

const rootFolder = path.join(__dirname);
processFolder(rootFolder);
