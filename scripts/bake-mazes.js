#!/usr/bin/env node
/**
 * Bake all level mazes into js/mazes-data.js and refresh js/levels-catalog.js.
 * Existing first-15 mazes are copied from the previous bake when present (unchanged).
 *
 * Run: node scripts/bake-mazes.js
 * Optional: scripts/known-seeds-99.json speeds up rebuild with pre-picked seeds.
 */
const fs = require('fs');
const path = require('path');
const MazeCore = require('../js/maze-core.js');
const { THEMES, paletteFor } = require('./new-level-themes.js');

const ORIGINAL_15 = [
  { id: 'forest', title: '森林小动物', size: 10, seed: 120, maxNest: 2, theme: 'forest', playerEmoji: '🦊', goalEmoji: '🏠' },
  { id: 'ocean', title: '海底冒险', size: 15, seed: 102, maxNest: 2, theme: 'ocean', playerEmoji: '🐢', goalEmoji: '🐚' },
  { id: 'space', title: '星空火箭', size: 20, seed: 23, maxNest: 2, theme: 'space', playerEmoji: '🚀', goalEmoji: '🪐' },
  { id: 'candy', title: '糖果王国', size: 15, seed: 46, maxNest: 2, theme: 'candy', playerEmoji: '🍬', goalEmoji: '🍭' },
  { id: 'dino', title: '恐龙乐园', size: 15, seed: 62, maxNest: 3, theme: 'dino', playerEmoji: '🦕', goalEmoji: '🥚' },
  { id: 'farm', title: '开心农场', size: 15, seed: 2, maxNest: 2, theme: 'farm', playerEmoji: '🐑', goalEmoji: '🌾' },
  { id: 'pirate', title: '海盗寻宝', size: 20, seed: 16, maxNest: 2, theme: 'pirate', playerEmoji: '🏴‍☠️', goalEmoji: '💎' },
  { id: 'snow', title: '雪地小屋', size: 20, seed: 8, maxNest: 3, theme: 'snow', playerEmoji: '🐧', goalEmoji: '⛄' },
  { id: 'volcano', title: '火山探险', size: 20, seed: 30, maxNest: 2, theme: 'volcano', playerEmoji: '🦎', goalEmoji: '🌋' },
  { id: 'garden', title: '蝴蝶花园', size: 25, seed: 26, maxNest: 2, theme: 'garden', playerEmoji: '🦋', goalEmoji: '🌸' },
  { id: 'train', title: '小火车', size: 25, seed: 11, maxNest: 3, theme: 'train', playerEmoji: '🚂', goalEmoji: '🚉' },
  { id: 'castle', title: '城堡骑士', size: 25, seed: 50, maxNest: 2, theme: 'castle', playerEmoji: '🐴', goalEmoji: '🏰' },
  { id: 'desert', title: '沙漠绿洲', size: 30, seed: 58, maxNest: 2, theme: 'desert', playerEmoji: '🐪', goalEmoji: '🌴' },
  { id: 'rainbow', title: '彩虹滑梯', size: 30, seed: 34, maxNest: 3, theme: 'rainbow', playerEmoji: '🦄', goalEmoji: '🌈' },
  { id: 'moon', title: '月亮兔子', size: 30, seed: 31, maxNest: 2, theme: 'moon', playerEmoji: '🐰', goalEmoji: '🌙' },
];

const TOTAL = ORIGINAL_15.length + THEMES.length; // 99 for now
const usedSeeds = new Set(ORIGINAL_15.map((l) => l.seed));

const knownPath = path.join(__dirname, 'known-seeds-99.json');
const knownSeeds = fs.existsSync(knownPath) ? JSON.parse(fs.readFileSync(knownPath, 'utf8')) : {};

function pathFingerprint(maze) {
  const cells = [...MazeCore.solutionCells(maze)].sort();
  let h = maze.size * 10007;
  for (const key of cells) {
    for (let i = 0; i < key.length; i++) h = (h * 33 + key.charCodeAt(i)) >>> 0;
  }
  const mid = maze.cells[Math.floor(maze.size / 2)][Math.floor(maze.size / 2)];
  h = (h ^ (mid * 2654435761)) >>> 0;
  return `${maze.size}:${cells.length}:${h.toString(16)}`;
}

function sizeForIndex(i) {
  // i = 0..83 → ramp 15–35, then four larger boards (38/40/42/45).
  if (i < 80) return 15 + Math.round((35 - 15) * (i / 79));
  return [38, 40, 42, 45][i - 80];
}

function nestForIndex(i, size) {
  if (size >= 28) return 3;
  if (i % 3 === 2) return 3;
  return 2;
}

function pickSeed(size, maxNest, usedPaths, startSeed) {
  let seed = startSeed;
  const limit = startSeed + 8000;
  while (seed < limit) {
    if (usedSeeds.has(seed)) {
      seed++;
      continue;
    }
    let maze;
    try {
      maze = MazeCore.generateMaze(size, seed, maxNest);
    } catch {
      seed++;
      continue;
    }
    if (MazeCore.countPaths(maze) !== 1) {
      seed++;
      continue;
    }
    const stats = MazeCore.mazeStats(maze);
    if (stats.wrongForkNest > maxNest) {
      seed++;
      continue;
    }
    const fp = pathFingerprint(maze);
    if (usedPaths.has(fp)) {
      seed++;
      continue;
    }
    return { seed, maze, fp, stats };
  }
  throw new Error(`no seed for size=${size} nest≤${maxNest}`);
}

function bakeKnown(id, size, maxNest, seed, usedPaths) {
  const maze = MazeCore.generateMaze(size, seed, maxNest);
  if (MazeCore.countPaths(maze) !== 1) {
    throw new Error(`${id}: known seed produced ${MazeCore.countPaths(maze)} paths`);
  }
  const stats = MazeCore.mazeStats(maze);
  if (stats.wrongForkNest > maxNest) {
    throw new Error(`${id}: nest ${stats.wrongForkNest} > ${maxNest}`);
  }
  const fp = pathFingerprint(maze);
  if (usedPaths.has(fp)) throw new Error(`${id}: duplicate path fingerprint`);
  return { seed, maze, fp, stats };
}

const dataPath = path.join(__dirname, '..', 'js', 'mazes-data.js');
let previous = {};
if (fs.existsSync(dataPath)) {
  previous = require(dataPath);
}

const data = {};
const catalog = [];
const usedPaths = new Set();

for (const meta of ORIGINAL_15) {
  let baked = previous[meta.id];
  if (!baked) {
    console.log('regenerating missing original', meta.id);
    const maze = MazeCore.generateMaze(meta.size, meta.seed, meta.maxNest);
    baked = {
      size: maze.size,
      cells: maze.cells,
      start: maze.start,
      goal: maze.goal,
      maxNest: meta.maxNest,
    };
  }
  if (baked.size !== meta.size) {
    throw new Error(`baked size mismatch for ${meta.id}`);
  }
  data[meta.id] = {
    size: baked.size,
    cells: baked.cells,
    start: baked.start,
    goal: baked.goal,
    maxNest: meta.maxNest,
  };
  usedPaths.add(
    pathFingerprint({
      size: baked.size,
      cells: baked.cells,
      start: baked.start,
      goal: baked.goal,
    })
  );
  catalog.push({ ...meta, colors: null });
  console.log(`keep ${meta.id}: ${meta.size}×${meta.size}`);
}

let seedCursor = 200;
for (let i = 0; i < THEMES.length; i++) {
  const [id, title, playerEmoji, goalEmoji] = THEMES[i];
  const size = sizeForIndex(i);
  const maxNest = nestForIndex(i, size);
  const t0 = Date.now();
  const known = knownSeeds[id];
  let result;
  if (known && known.size === size && known.maxNest === maxNest) {
    result = bakeKnown(id, size, maxNest, known.seed, usedPaths);
  } else {
    result = pickSeed(size, maxNest, usedPaths, seedCursor);
  }
  const { seed, maze, fp, stats } = result;
  usedSeeds.add(seed);
  usedPaths.add(fp);
  seedCursor = Math.max(seedCursor, seed + 1);
  data[id] = {
    size: maze.size,
    cells: maze.cells,
    start: maze.start,
    goal: maze.goal,
    maxNest,
  };
  catalog.push({
    id,
    title,
    size,
    seed,
    maxNest,
    theme: id,
    playerEmoji,
    goalEmoji,
    colors: paletteFor(i),
  });
  console.log(
    `bake ${id}: ${size}×${size} nest≤${maxNest} seed=${seed} fork=${stats.wrongForkNest} (${Date.now() - t0}ms)`
  );
}

if (catalog.length !== TOTAL) throw new Error(`expected ${TOTAL} catalog entries, got ${catalog.length}`);
if (Object.keys(data).length !== TOTAL) {
  throw new Error(`expected ${TOTAL} baked mazes, got ${Object.keys(data).length}`);
}

const mazesBody = `(function (root) {
  const MAZES_DATA = ${JSON.stringify(data)};
  root.MAZES_DATA = MAZES_DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = MAZES_DATA;
})(typeof globalThis !== 'undefined' ? globalThis : this);
`;
fs.writeFileSync(dataPath, mazesBody, 'utf8');

const catalogPath = path.join(__dirname, '..', 'js', 'levels-catalog.js');
const catalogBody = `(function (root) {
  const LEVEL_CATALOG = ${JSON.stringify(catalog, null, 2)};
  root.LEVEL_CATALOG = LEVEL_CATALOG;
  if (typeof module !== 'undefined' && module.exports) module.exports = LEVEL_CATALOG;
})(typeof globalThis !== 'undefined' ? globalThis : this);
`;
fs.writeFileSync(catalogPath, catalogBody, 'utf8');

console.log(
  'wrote',
  dataPath,
  `(${Math.round(fs.statSync(dataPath).size / 1024)} KB),`,
  catalogPath,
  `(${Math.round(fs.statSync(catalogPath).size / 1024)} KB)`,
  `levels=${TOTAL}`
);
