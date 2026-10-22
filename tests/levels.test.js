const MazeCore = require('../js/maze-core.js');
globalThis.MazeCore = MazeCore;
require('../js/levels.js');
const assert = require('assert');

assert.strictEqual(LEVELS.length, 3);
assert.deepStrictEqual(
  LEVELS.map((l) => l.size),
  [10, 15, 20]
);

const floors = {
  forest: { solutionJunctions: 10, wrongForkNest: 2 },
  ocean: { solutionJunctions: 20, wrongForkNest: 2 },
  space: { solutionJunctions: 30, wrongForkNest: 2 },
};

for (const level of LEVELS) {
  assert.strictEqual(MazeCore.countPaths(level.maze), 1, level.id);
  assert.ok(!level.maze.solid, `${level.id} must not use solid cells`);

  let reachable = 0;
  const size = level.size;
  const seen = Array.from({ length: size }, () => Array(size).fill(false));
  const q = [{ ...level.maze.start }];
  seen[level.maze.start.r][level.maze.start.c] = true;
  while (q.length) {
    const { r, c } = q.shift();
    reachable++;
    for (const d of ['N', 'E', 'S', 'W']) {
      const res = MazeCore.tryMove(level.maze, { r, c }, d);
      if (!res.moved) continue;
      if (seen[res.pos.r][res.pos.c]) continue;
      seen[res.pos.r][res.pos.c] = true;
      q.push(res.pos);
    }
  }
  assert.strictEqual(reachable, size * size, `${level.id} full grid`);

  const stats = MazeCore.mazeStats(level.maze);
  const floor = floors[level.id];
  assert.ok(
    stats.solutionJunctions >= floor.solutionJunctions,
    `${level.id} solutionJunctions ${stats.solutionJunctions}`
  );
  assert.ok(
    stats.wrongForkNest <= floor.wrongForkNest,
    `${level.id} wrongForkNest ${stats.wrongForkNest}`
  );
}
console.log('All levels tests passed.');
