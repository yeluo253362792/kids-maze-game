const MazeCore = require('../js/maze-core.js');
globalThis.MazeCore = MazeCore;
globalThis.MAZES_DATA = require('../js/mazes-data.js');
globalThis.LEVEL_CATALOG = require('../js/levels-catalog.js');
require('../js/levels.js');
const assert = require('assert');

assert.strictEqual(LEVELS.length, 99);

const ORIGINAL_IDS = [
  'forest', 'ocean', 'space', 'candy', 'dino', 'farm', 'pirate', 'snow',
  'volcano', 'garden', 'train', 'castle', 'desert', 'rainbow', 'moon',
];
assert.deepStrictEqual(
  LEVELS.slice(0, 15).map((l) => l.id),
  ORIGINAL_IDS,
  'first 15 levels must stay unchanged'
);

const ids = new Set();
const themes = new Set();
const seeds = new Set();
const pathPrints = new Set();

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

for (const level of LEVELS) {
  assert.ok(!ids.has(level.id), `duplicate id ${level.id}`);
  ids.add(level.id);
  assert.ok(!themes.has(level.theme), `duplicate theme ${level.theme}`);
  themes.add(level.theme);
  assert.ok(!seeds.has(level.seed), `duplicate seed ${level.seed}`);
  seeds.add(level.seed);

  assert.ok(level.maxNest === 2 || level.maxNest === 3, level.id);

  const maze = ensureMaze(level);
  assert.ok(maze && maze.cells, `${level.id} has baked maze`);
  assert.strictEqual(maze.size, level.size, level.id);
  assert.strictEqual(MazeCore.countPaths(maze), 1, level.id);

  const stats = MazeCore.mazeStats(maze);
  assert.ok(
    stats.wrongForkNest <= level.maxNest,
    `${level.id} forkNest ${stats.wrongForkNest}`
  );

  const fp = pathFingerprint(maze);
  assert.ok(!pathPrints.has(fp), `duplicate solution path ${level.id}`);
  pathPrints.add(fp);

  let reachable = 0;
  const size = level.size;
  const seen = Array.from({ length: size }, () => Array(size).fill(false));
  const q = [{ ...maze.start }];
  seen[maze.start.r][maze.start.c] = true;
  for (let qi = 0; qi < q.length; qi++) {
    const { r, c } = q[qi];
    reachable++;
    for (const d of ['N', 'E', 'S', 'W']) {
      const res = MazeCore.tryMove(maze, { r, c }, d);
      if (!res.moved || seen[res.pos.r][res.pos.c]) continue;
      seen[res.pos.r][res.pos.c] = true;
      q.push(res.pos);
    }
  }
  assert.strictEqual(reachable, size * size, `${level.id} full grid`);
}

for (const level of LEVELS.slice(15)) {
  assert.ok(level.size >= 15 && level.size <= 50, level.id);
  assert.ok(level.colors, `${level.id} needs palette colors`);
}

const sizes = new Set(LEVELS.slice(15).map((l) => l.size));
assert.ok(sizes.has(15), 'new levels include 15');
assert.ok(sizes.has(45), 'new levels include 45');
assert.ok(
  [...sizes].every((s) => s >= 15 && s <= 45),
  'new level sizes in 15–45'
);

console.log('All levels tests passed.');
