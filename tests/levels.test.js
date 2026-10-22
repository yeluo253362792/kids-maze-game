// levels.test.js — run after maze-core exists; levels.js expects MazeCore global or require
const MazeCore = require('../js/maze-core.js');
globalThis.MazeCore = MazeCore;
require('../js/levels.js');
const assert = require('assert');

assert.strictEqual(LEVELS.length, 3);
assert.deepStrictEqual(LEVELS.map((l) => l.size), [10, 15, 20]);

const minBranch = {
  forest: { deadEnds: 30, solutionJunctions: 12 },
  ocean: { deadEnds: 60, solutionJunctions: 18 },
  space: { deadEnds: 100, solutionJunctions: 24 },
};

for (const level of LEVELS) {
  assert.strictEqual(MazeCore.countPaths(level.maze), 1, level.id);
  const stats = MazeCore.mazeStats(level.maze);
  const floor = minBranch[level.id];
  assert.ok(
    stats.deadEnds >= floor.deadEnds,
    `${level.id} deadEnds ${stats.deadEnds} < ${floor.deadEnds}`
  );
  assert.ok(
    stats.solutionJunctions >= floor.solutionJunctions,
    `${level.id} solutionJunctions ${stats.solutionJunctions} < ${floor.solutionJunctions}`
  );
}
console.log('All levels tests passed.');
