#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.join(__dirname, "..");

function usage() {
  console.log(
    "Usage: node _housekeeping/serve-all.js [--start-port=3000] [--folders=angular,nextjs,plain,react] [--verbose]"
  );
}

const argv = process.argv.slice(2);
const opts = {
  startPort: 3000,
  folders: ["angular", "nextjs", "plain", "react"],
  verbose: false,
};

for (const a of argv) {
  if (a === "--help" || a === "-h") {
    usage();
    process.exit(0);
  }
  if (a === "--verbose") opts.verbose = true;
  if (a.startsWith("--start-port=")) {
    const v = parseInt(a.split("=")[1], 10);
    if (!Number.isNaN(v)) opts.startPort = v;
  }
  if (a.startsWith("--folders=")) {
    const v = a.split("=")[1];
    if (v)
      opts.folders = v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
  }
}

if (opts.verbose) console.log("Options:", opts);

function findDistDirs(base) {
  const results = [];
  function walk(dir) {
    let items;
    try {
      items = fs.readdirSync(dir);
    } catch (err) {
      if (opts.verbose) console.debug("readdir", dir, err && err.message);
      return;
    }
    for (const it of items) {
      const p = path.join(dir, it);
      let stat;
      try {
        stat = fs.statSync(p);
      } catch (err) {
        if (opts.verbose) console.debug("stat", p, err && err.message);
        continue;
      }
      if (!stat.isDirectory()) continue;
      if (it === "node_modules") continue;
      if (it === "dist" || it === "out") results.push(p);
      else walk(p);
    }
  }
  walk(base);
  return results;
}

function nearestPackageInfo(distPath) {
  let dir = path.dirname(distPath);
  const root = path.parse(dir).root;
  while (dir && dir !== root) {
    const pkg = path.join(dir, "package.json");
    try {
      if (fs.existsSync(pkg)) return { pkg, dir };
    } catch (err) {
      if (opts.verbose) console.debug("pkg check", pkg, err && err.message);
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function getProjectNameFromPackage(dir) {
  try {
    const pkg = path.join(dir, "package.json");
    if (!fs.existsSync(pkg)) return path.basename(dir);
    const data = fs.readFileSync(pkg, "utf8");
    const parsed = JSON.parse(data);
    return parsed && parsed.name ? parsed.name : path.basename(dir);
  } catch (err) {
    if (opts.verbose) console.debug("read pkg", dir, err && err.message);
    return path.basename(dir);
  }
}

function startServers() {
  const allDist = [];
  for (const f of opts.folders) {
    const folderPath = path.join(ROOT, f);
    if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
      allDist.push(...findDistDirs(folderPath));
    }
  }

  if (allDist.length === 0) {
    console.log("No dist folders found under " + opts.folders.join(", "));
    return;
  }

  const filtered = allDist.filter((distPath) => {
    const info = nearestPackageInfo(distPath);
    if (!info) return false;
    const rel = info.dir.split(path.sep).join("/");
    if (rel.includes("/node_modules/")) return false;
    return true;
  });

  if (filtered.length === 0) {
    console.log("No project dist folders found (node_modules excluded).");
    return;
  }

  const servers = [];
  const procs = [];
  let port = opts.startPort;

  for (const distPath of filtered) {
    const info = nearestPackageInfo(distPath);
    const project = info
      ? getProjectNameFromPackage(info.dir)
      : path.basename(path.dirname(distPath));
    const rel = path.relative(ROOT, distPath) || distPath;
    const args = ["serve", "-s", ".", "-l", String(port)];
    // if verbose, show serve output in console; otherwise suppress it
    const stdio = [
      "ignore",
      opts.verbose ? "inherit" : "ignore",
      opts.verbose ? "inherit" : "ignore",
    ];
    const child = spawn("npx", args, { cwd: distPath, stdio });

    const proc = { child, port, project, rel };
    procs.push(proc);

    const url = `http://localhost:${port}/`;
    servers.push({ project, distPath, port, url, rel });

    child.on("error", (err) => {
      console.error(
        `Failed to start server for ${rel}:`,
        err && err.message ? err.message : err
      );
    });
    child.on("exit", (code, signal) => {
      console.log(
        `Server for ${rel} exited with code=${code} signal=${signal}`
      );
    });

    port += 1;
  }

  console.log("\nServers running:");
  for (const s of servers)
    console.log(`${s.project} -> ${s.url} (dist: ${s.rel})`);
    console.log("\nPress Ctrl+C to stop all servers.");

  function teardown() {
    console.log("\nShutting down servers...");
    for (const p of procs) {
      try {
        p.child.kill("SIGINT");
      } catch (err) {
        if (opts.verbose) console.debug("kill err", err && err.message);
      }
    }
    setTimeout(() => process.exit(0), 500);
  }

  process.on("SIGINT", teardown);
  process.on("SIGTERM", teardown);
}

startServers();
