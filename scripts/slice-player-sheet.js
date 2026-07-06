#!/usr/bin/env node
"use strict";

var childProcess = require("child_process");
var fs = require("fs");
var path = require("path");

var FFMPEG = "/opt/homebrew/bin/ffmpeg";
var FFPROBE = "/opt/homebrew/bin/ffprobe";

function usage() {
  console.error("Usage: node scripts/slice-player-sheet.js <sheet.png> <startId> <count> [cols] [rows] [--force]");
  process.exit(1);
}

var args = process.argv.slice(2);
if (args.length < 3) usage();

var sheet = args[0];
var startId = Number(args[1]);
var count = Number(args[2]);
var cols = Number(args[3] || 5);
var rows = Number(args[4] || Math.ceil(count / cols));
var force = args.indexOf("--force") !== -1;

if (!fs.existsSync(sheet) || !Number.isFinite(startId) || !Number.isFinite(count) || !Number.isFinite(cols) || !Number.isFinite(rows)) usage();
if (!fs.existsSync(FFMPEG) || !fs.existsSync(FFPROBE)) {
  console.error("ffmpeg/ffprobe not found at expected Homebrew paths.");
  process.exit(1);
}

var dimensions = childProcess.execFileSync(FFPROBE, [
  "-v", "error",
  "-select_streams", "v:0",
  "-show_entries", "stream=width,height",
  "-of", "csv=s=x:p=0",
  sheet
], { encoding: "utf8" }).trim().split("x").map(Number);

var width = dimensions[0];
var height = dimensions[1];
var cellW = width / cols;
var cellH = height / rows;
var padX = Math.max(0, Math.floor(cellW * 0.035));
var padY = Math.max(0, Math.floor(cellH * 0.025));
var cropW = Math.floor(cellW - padX * 2);
var cropH = Math.floor(cellH - padY * 2);
var written = [];
var skipped = [];

for (var index = 0; index < count; index += 1) {
  var id = startId + index;
  var col = index % cols;
  var row = Math.floor(index / cols);
  var out = path.join("assets", "players", "player-" + String(id).padStart(3, "0") + ".png");

  if (!force && fs.existsSync(out)) {
    skipped.push(out);
    continue;
  }

  var x = Math.floor(col * cellW + padX);
  var y = Math.floor(row * cellH + padY);
  childProcess.execFileSync(FFMPEG, [
    "-hide_banner",
    "-loglevel", "error",
    "-y",
    "-i", sheet,
    "-vf", "crop=" + cropW + ":" + cropH + ":" + x + ":" + y,
    "-frames:v", "1",
    out
  ]);
  written.push(out);
}

console.log(JSON.stringify({
  sheet: sheet,
  dimensions: { width: width, height: height },
  grid: { cols: cols, rows: rows },
  count: count,
  written: written.length,
  skipped: skipped.length
}, null, 2));
