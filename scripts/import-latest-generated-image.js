#!/usr/bin/env node
"use strict";

var fs = require("fs");
var path = require("path");

var out = process.argv[2];
if (!out) {
  console.error("Usage: node scripts/import-latest-generated-image.js <destination.png>");
  process.exit(1);
}

var root = path.join(process.env.HOME || "", ".codex", "generated_images");
if (!fs.existsSync(root)) {
  console.error("Generated image directory not found: " + root);
  process.exit(1);
}

var latest = null;
function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (entry) {
    var full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      return;
    }
    if (!/\.(png|jpe?g|webp)$/i.test(entry.name)) return;
    var stat = fs.statSync(full);
    if (!latest || stat.mtimeMs > latest.mtimeMs) latest = { file: full, mtimeMs: stat.mtimeMs };
  });
}

walk(root);
if (!latest) {
  console.error("No generated images found under: " + root);
  process.exit(1);
}

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.copyFileSync(latest.file, out);
console.log(JSON.stringify({ source: latest.file, destination: out }, null, 2));
