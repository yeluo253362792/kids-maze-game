#!/usr/bin/env node
/**
 * Precompute all level mazes into js/mazes-data.js so the browser never generates them.
 * Run: node scripts/bake-mazes.js
 */
const fs = require('fs');
const path = require('path');
const MazeCore = require('../js/maze-core.js');

const LEVEL_SPECS = [
  { id: 'forest', size: 10, seed: 120, maxNest: 2 },
  { id: 'ocean', size: 15, seed: 102, maxNest: 2 },
  { id: 'space', size: 20, seed: 23, maxNest: 2 },
  { id: 'candy', size: 15, seed: 46, maxNest: 2 },
  { id: 'dino', size: 15, seed: 62, maxNest: 3 },
  { id: 'farm', size: 15, seed: 2, maxNest: 2 },
  { id: 'pirate', size: 20, seed: 16, maxNest: 2 },
  { id: 'snow', size: 20, seed: 8, maxNest: 3 },
  { id: 'volcano', size: 20, seed: 30, maxNest: 2 },
  { id: 'garden', size: 25, seed: 26, maxNest: 2 },
  { id: 'train', size: 25, seed: 11, maxNest: 3 },
  { id: 'castle', size: 25, seed: 50, maxNest: 2 },
  { id: 'desert', size: 30, seed: 58, maxNest: 2 },
  { id: 'rainbow', size: 30, seed: 34, maxNest: 3 },
  { id: 'moon', size: 30, seed: 31, maxNest: 2 },
];

const data = {};
for (const spec of LEVEL_SPECS) {
  const t0 = Date.now();
  const maze = MazeCore.generateMaze(spec.size, spec.seed, spec.maxNest);
  const paths = MazeCore.countPaths(maze);
  const stats = MazeCore.mazeStats(maze);
  if (paths !== 1) throw new Error(`${spec.id}: expected 1 path, got ${paths}`);
  if (stats.wrongForkNest > spec.maxNest) {
    throw new Error(`${spec.id}: nest ${stats.wrongForkNest} > ${spec.maxNest}`);
  }
  data[spec.id] = {
    size: maze.size,
    cells: maze.cells,
    start: maze.start,
    goal: maze.goal,
    maxNest: spec.maxNest,
  };
  console.log(
    `baked ${spec.id}: ${spec.size}×${spec.size} nest≤${spec.maxNest} (${Date.now() - t0}ms)`
  );
}

const outPath = path.join(__dirname, '..', 'js', 'mazes-data.js');
const body = `(function (root) {
  const MAZES_DATA = ${JSON.stringify(data)};
  root.MAZES_DATA = MAZES_DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = MAZES_DATA;
})(typeof globalThis !== 'undefined' ? globalThis : this);
`;
fs.writeFileSync(outPath, body, 'utf8');
console.log('wrote', outPath, `(${Math.round(fs.statSync(outPath).size / 1024)} KB)`);
