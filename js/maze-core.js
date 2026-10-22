(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.MazeCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const N = 1, E = 2, S = 4, W = 8;
  const DELTA = { N: [-1, 0], E: [0, 1], S: [1, 0], W: [0, -1] };
  const OPP = { N: S, E: W, S: N, W: E };
  const BITS = { N, E, S, W };
  const DIRS = ['N', 'E', 'S', 'W'];

  function mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function openingCount(cell) {
    let n = 0;
    for (const dir of DIRS) if (!(cell & BITS[dir])) n++;
    return n;
  }

  /** Prim's algorithm: more dead-ends and forks than DFS backtracker. */
  function generateMaze(size, seed) {
    const cells = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => N | E | S | W)
    );
    const rnd = mulberry32(seed >>> 0);
    const inMaze = Array.from({ length: size }, () => Array(size).fill(false));
    const frontier = [];

    function addFrontier(r, c) {
      for (const dir of DIRS) {
        const [dr, dc] = DELTA[dir];
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= size || nc >= size) continue;
        if (inMaze[nr][nc]) continue;
        if (!frontier.some((f) => f.r === nr && f.c === nc)) {
          frontier.push({ r: nr, c: nc });
        }
      }
    }

    inMaze[0][0] = true;
    addFrontier(0, 0);

    while (frontier.length) {
      const i = Math.floor(rnd() * frontier.length);
      const { r, c } = frontier.splice(i, 1)[0];
      const neighbors = [];
      for (const dir of DIRS) {
        const [dr, dc] = DELTA[dir];
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= size || nc >= size) continue;
        if (inMaze[nr][nc]) neighbors.push(dir);
      }
      if (!neighbors.length) continue;
      const dir = neighbors[Math.floor(rnd() * neighbors.length)];
      const [dr, dc] = DELTA[dir];
      cells[r][c] &= ~BITS[dir];
      cells[r + dr][c + dc] &= ~OPP[dir];
      inMaze[r][c] = true;
      addFrontier(r, c);
    }

    return {
      size,
      cells,
      start: { r: 0, c: 0 },
      goal: { r: size - 1, c: size - 1 },
    };
  }

  function tryMove(maze, pos, dir) {
    const bit = BITS[dir];
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
      for (const dir of DIRS) {
        if (cells[r][c] & BITS[dir]) continue;
        const [dr, dc] = DELTA[dir];
        const nr = r + dr;
        const nc = c + dc;
        if (seen[nr][nc]) continue;
        dfs(nr, nc);
      }
      seen[r][c] = false;
    }
    dfs(start.r, start.c);
    return count;
  }

  /** Branching stats for difficulty checks (unique-path mazes). */
  function mazeStats(maze) {
    const { size, cells, start, goal } = maze;
    let deadEnds = 0;
    let junctions = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const o = openingCount(cells[r][c]);
        if (o === 1) deadEnds++;
        if (o >= 3) junctions++;
      }
    }

    const prev = Array.from({ length: size }, () => Array(size).fill(null));
    const seen = Array.from({ length: size }, () => Array(size).fill(false));
    const queue = [{ r: start.r, c: start.c }];
    seen[start.r][start.c] = true;
    while (queue.length) {
      const { r, c } = queue.shift();
      if (r === goal.r && c === goal.c) break;
      for (const dir of DIRS) {
        if (cells[r][c] & BITS[dir]) continue;
        const [dr, dc] = DELTA[dir];
        const nr = r + dr;
        const nc = c + dc;
        if (seen[nr][nc]) continue;
        seen[nr][nc] = true;
        prev[nr][nc] = { r, c };
        queue.push({ r: nr, c: nc });
      }
    }

    let solutionLength = 0;
    let solutionJunctions = 0;
    let cur = { r: goal.r, c: goal.c };
    while (!(cur.r === start.r && cur.c === start.c)) {
      solutionLength++;
      if (openingCount(cells[cur.r][cur.c]) >= 3) solutionJunctions++;
      cur = prev[cur.r][cur.c];
      if (!cur) break;
    }

    return { deadEnds, junctions, solutionLength, solutionJunctions };
  }

  return {
    generateMaze,
    tryMove,
    isAtGoal,
    countPaths,
    mazeStats,
    WALL: { N, E, S, W },
  };
});
