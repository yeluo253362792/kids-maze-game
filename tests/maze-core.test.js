const assert = require('assert');
const { generateMaze, tryMove, isAtGoal, countPaths } = require('../js/maze-core.js');

const maze = generateMaze(10, 42);
assert.strictEqual(maze.size, 10);
assert.strictEqual(maze.cells.length, 10);
assert.strictEqual(maze.cells[0].length, 10);
assert.strictEqual(countPaths(maze), 1, 'perfect maze must have exactly one path');

const blocked = tryMove(maze, maze.start, 'N'); // start is (0,0); N usually blocked
assert.strictEqual(blocked.bumped || blocked.moved, true);

let pos = { ...maze.start };
const dirs = ['E', 'S', 'W', 'N'];
// smoke: some legal move exists from start
const any = dirs.map((d) => tryMove(maze, pos, d)).some((r) => r.moved);
assert.ok(any, 'start must have at least one open direction');

assert.strictEqual(isAtGoal(maze, maze.goal), true);
assert.strictEqual(isAtGoal(maze, maze.start), false);

for (const [size, seed] of [[10, 1], [15, 2], [20, 3]]) {
  const m = generateMaze(size, seed);
  assert.strictEqual(countPaths(m), 1, `${size}x${size} seed ${seed}`);
}

console.log('All maze-core tests passed.');
