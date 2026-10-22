const assert = require('assert');
const {
  generateMaze,
  tryMove,
  isAtGoal,
  countPaths,
  mazeStats,
  DEFAULT_MAX_WRONG_NEST,
} = require('../js/maze-core.js');

const maze = generateMaze(10, 42, 2);
assert.strictEqual(maze.size, 10);
assert.strictEqual(countPaths(maze), 1, 'perfect maze must have exactly one path');
assert.ok(mazeStats(maze).wrongForkNest <= 2);

const blocked = tryMove(maze, maze.start, 'N');
assert.strictEqual(blocked.bumped || blocked.moved, true);

const dirs = ['E', 'S', 'W', 'N'];
assert.ok(dirs.map((d) => tryMove(maze, maze.start, d)).some((r) => r.moved));
assert.strictEqual(isAtGoal(maze, maze.goal), true);
assert.strictEqual(isAtGoal(maze, maze.start), false);

for (const [size, seed, maxNest] of [
  [10, 1, 2],
  [15, 2, 2],
  [15, 3, 3],
  [20, 4, 2],
  [25, 5, 3],
]) {
  const m = generateMaze(size, seed, maxNest);
  assert.strictEqual(countPaths(m), 1, `${size} nest${maxNest}`);
  assert.ok(
    mazeStats(m).wrongForkNest <= maxNest,
    `${size} nest cap`
  );

  let reachable = 0;
  const seen = Array.from({ length: size }, () => Array(size).fill(false));
  const q = [{ ...m.start }];
  seen[m.start.r][m.start.c] = true;
  while (q.length) {
    const { r, c } = q.shift();
    reachable++;
    for (const d of dirs) {
      const res = tryMove(m, { r, c }, d);
      if (!res.moved || seen[res.pos.r][res.pos.c]) continue;
      seen[res.pos.r][res.pos.c] = true;
      q.push(res.pos);
    }
  }
  assert.strictEqual(reachable, size * size, `${size} full grid`);
}

assert.strictEqual(DEFAULT_MAX_WRONG_NEST, 2);
console.log('All maze-core tests passed.');
