const MazeCore = require('../js/maze-core.js');
globalThis.MazeCore = MazeCore;
globalThis.MAZES_DATA = require('../js/mazes-data.js');
require('../js/levels.js');
const assert = require('assert');

assert.strictEqual(LEVELS.length, 15);

const ids = new Set();
const themes = new Set();
const seeds = new Set();

for (const level of LEVELS) {
  assert.ok(!ids.has(level.id), `duplicate id ${level.id}`);
  ids.add(level.id);
  assert.ok(!themes.has(level.theme), `duplicate theme ${level.theme}`);
  themes.add(level.theme);
  assert.ok(!seeds.has(level.seed), `duplicate seed ${level.seed}`);
  seeds.add(level.seed);

  assert.ok([10, 15, 20, 25, 30].includes(level.size), level.id);
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

  let reachable = 0;
  const size = level.size;
  const seen = Array.from({ length: size }, () => Array(size).fill(false));
  const q = [{ ...maze.start }];
  seen[maze.start.r][maze.start.c] = true;
  while (q.length) {
    const { r, c } = q.shift();
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

const newSizes = LEVELS.slice(3).map((l) => l.size).sort((a, b) => a - b);
assert.deepStrictEqual(
  [...new Set(newSizes)],
  [15, 20, 25, 30],
  '12 new levels should cover 15/20/25/30'
);

console.log('All levels tests passed.');
