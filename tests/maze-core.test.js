const assert = require('assert');
const {
  generateMaze,
  tryMove,
  isAtGoal,
  countPaths,
  mazeStats,
  MAX_WRONG_NEST,
} = require('../js/maze-core.js');

const maze = generateMaze(10, 42);
assert.strictEqual(maze.size, 10);
assert.strictEqual(maze.cells.length, 10);
assert.strictEqual(maze.cells[0].length, 10);
assert.ok(!maze.solid, 'all cells must be walkable (no solid mask)');
assert.strictEqual(countPaths(maze), 1, 'perfect maze must have exactly one path');

const blocked = tryMove(maze, maze.start, 'N');
assert.strictEqual(blocked.bumped || blocked.moved, true);

let pos = { ...maze.start };
const dirs = ['E', 'S', 'W', 'N'];
const any = dirs.map((d) => tryMove(maze, pos, d)).some((r) => r.moved);
assert.ok(any, 'start must have at least one open direction');

assert.strictEqual(isAtGoal(maze, maze.goal), true);
assert.strictEqual(isAtGoal(maze, maze.start), false);

for (const [size, seed] of [[10, 1], [15, 2], [20, 3]]) {
  const m = generateMaze(size, seed);
  assert.strictEqual(countPaths(m), 1, `${size}x${size} seed ${seed}`);
  // Every cell reachable from start (full grid spanning tree)
  let reachable = 0;
  const seen = Array.from({ length: size }, () => Array(size).fill(false));
  const q = [{ ...m.start }];
  seen[m.start.r][m.start.c] = true;
  while (q.length) {
    const { r, c } = q.shift();
    reachable++;
    for (const d of dirs) {
      const res = tryMove(m, { r, c }, d);
      if (!res.moved) continue;
      if (seen[res.pos.r][res.pos.c]) continue;
      seen[res.pos.r][res.pos.c] = true;
      q.push(res.pos);
    }
  }
  assert.strictEqual(reachable, size * size, `${size} all cells reachable`);
}

const curated = mazeStats(generateMaze(10, 1322));
assert.ok(curated.solutionJunctions >= 8, `solutionJunctions ${curated.solutionJunctions}`);
assert.ok(
  curated.wrongForkNest <= MAX_WRONG_NEST,
  `wrongForkNest ${curated.wrongForkNest}`
);

console.log('All maze-core tests passed.');
