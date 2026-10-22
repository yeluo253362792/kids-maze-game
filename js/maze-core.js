(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.MazeCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const N = 1, E = 2, S = 4, W = 8;
  const DELTA = { N: [-1, 0], E: [0, 1], S: [1, 0], W: [0, -1] };
  const OPP = { N: S, E: W, S: N, W: E };

  function mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, rnd) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function generateMaze(size, seed) {
    const cells = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => N | E | S | W)
    );
    const rnd = mulberry32(seed >>> 0);
    const visited = Array.from({ length: size }, () => Array(size).fill(false));

    function carve(r, c) {
      visited[r][c] = true;
      const order = shuffle(['N', 'E', 'S', 'W'], rnd);
      for (const dir of order) {
        const [dr, dc] = DELTA[dir];
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= size || nc >= size) continue;
        if (visited[nr][nc]) continue;
        cells[r][c] &= ~({ N, E, S, W }[dir]);
        cells[nr][nc] &= ~OPP[dir];
        carve(nr, nc);
      }
    }

    carve(0, 0);
    return {
      size,
      cells,
      start: { r: 0, c: 0 },
      goal: { r: size - 1, c: size - 1 },
    };
  }

  function tryMove(maze, pos, dir) {
    const bit = { N, E, S, W }[dir];
    if (maze.cells[pos.r][pos.c] & bit) {
      return { pos: { ...pos }, moved: false, bumped: true };
    }
    const [dr, dc] = DELTA[dir];
    return {
      pos: { r: pos.r + dr, c: pos.c + dc },
      moved: true,
      bumped: false,
    };
  }

  function isAtGoal(maze, pos) {
    return pos.r === maze.goal.r && pos.c === maze.goal.c;
  }

  function countPaths(maze) {
    const { size, cells, start, goal } = maze;
    let count = 0;
    const seen = Array.from({ length: size }, () => Array(size).fill(false));
    function dfs(r, c) {
      if (r === goal.r && c === goal.c) {
        count++;
        return;
      }
      seen[r][c] = true;
      for (const dir of ['N', 'E', 'S', 'W']) {
        const bit = { N, E, S, W }[dir];
        if (cells[r][c] & bit) continue;
        const [dr, dc] = DELTA[dir];
        const nr = r + dr, nc = c + dc;
        if (seen[nr][nc]) continue;
        dfs(nr, nc);
      }
      seen[r][c] = false;
    }
    dfs(start.r, start.c);
    return count;
  }

  return { generateMaze, tryMove, isAtGoal, countPaths, WALL: { N, E, S, W } };
});
