// levels.test.js — run after maze-core exists; levels.js expects MazeCore global or require
const MazeCore = require('../js/maze-core.js');
globalThis.MazeCore = MazeCore;
require('../js/levels.js');
const assert = require('assert');

assert.strictEqual(LEVELS.length, 3);
assert.deepStrictEqual(LEVELS.map((l) => l.size), [10, 15, 20]);
for (const level of LEVELS) {
  assert.strictEqual(MazeCore.countPaths(level.maze), 1, level.id);
}
console.log('All levels tests passed.');
