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
  /** Max wrong-path fork nesting (solution → wrong → wrong-on-wrong). */
  const MAX_WRONG_NEST = 2;

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

  function openingCount(cell) {
    let n = 0;
    for (const dir of DIRS) if (!(cell & BITS[dir])) n++;
    return n;
  }

  function dirBetween(a, b) {
    const dr = b.r - a.r;
    const dc = b.c - a.c;
    if (dr === -1 && dc === 0) return 'N';
    if (dr === 1 && dc === 0) return 'S';
    if (dr === 0 && dc === 1) return 'E';
    if (dr === 0 && dc === -1) return 'W';
    return null;
  }

  /**
   * Full-grid maze (every cell walkable), unique start→goal path.
   * Prefers attaching so wrong-path fork nesting stays ≤ MAX_WRONG_NEST:
   * nest0 = solution, nest1 = first wrong branch, nest2 = second layer
   * (nest-2 tips extend as corridors; forks at nest-2 only as last resort).
   */
  function generateMaze(size, seed) {
    const rnd = mulberry32(seed >>> 0);
    const start = { r: 0, c: 0 };
    const goal = { r: size - 1, c: size - 1 };
    const cells = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => N | E | S | W)
    );
    const nest = Array.from({ length: size }, () => Array(size).fill(-1));
    const carved = Array.from({ length: size }, () => Array(size).fill(false));

    // 1) Solution path
    const path = [];
    const onPath = Array.from({ length: size }, () => Array(size).fill(false));
    path.push({ ...start });
    onPath[0][0] = true;
    let guard = 0;
    const pathLimit = size * size * 10;
    while (!(path[path.length - 1].r === goal.r && path[path.length - 1].c === goal.c)) {
      if (++guard > pathLimit) {
        // Fall back: L-shaped path so generation always succeeds
        path.length = 0;
        for (let c = 0; c < size; c++) path.push({ r: 0, c });
        for (let r = 1; r < size; r++) path.push({ r, c: size - 1 });
        break;
      }
      const cur = path[path.length - 1];
      const opts = [];
      for (const d of DIRS) {
        const [dr, dc] = DELTA[d];
        const nr = cur.r + dr;
        const nc = cur.c + dc;
        if (nr < 0 || nc < 0 || nr >= size || nc >= size) continue;
        if (onPath[nr][nc]) continue;
        const before = Math.abs(goal.r - cur.r) + Math.abs(goal.c - cur.c);
        const after = Math.abs(goal.r - nr) + Math.abs(goal.c - nc);
        opts.push({ nr, nc, better: after < before });
      }
      if (!opts.length) {
        if (path.length <= 1) {
          path.length = 0;
          for (let c = 0; c < size; c++) path.push({ r: 0, c });
          for (let r = 1; r < size; r++) path.push({ r, c: size - 1 });
          break;
        }
        const dead = path.pop();
        onPath[dead.r][dead.c] = false;
        continue;
      }
      const better = opts.filter((o) => o.better);
      const choice =
        better.length && rnd() < 0.62
          ? better[Math.floor(rnd() * better.length)]
          : opts[Math.floor(rnd() * opts.length)];
      onPath[choice.nr][choice.nc] = true;
      path.push({ r: choice.nr, c: choice.nc });
    }

    function carveEdge(a, b) {
      const d = dirBetween(a, b);
      cells[a.r][a.c] &= ~BITS[d];
      cells[b.r][b.c] &= ~OPP[d];
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        carved[r][c] = false;
        nest[r][c] = -1;
        cells[r][c] = N | E | S | W;
      }
    }
    for (const p of path) {
      carved[p.r][p.c] = true;
      nest[p.r][p.c] = 0;
    }
    for (let i = 0; i < path.length - 1; i++) carveEdge(path[i], path[i + 1]);

    function carvedNeighbors(r, c) {
      const list = [];
      for (const d of DIRS) {
        const [dr, dc] = DELTA[d];
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= size || nc >= size) continue;
        if (carved[nr][nc]) list.push({ r: nr, c: nc });
      }
      return list;
    }

    function rankParent(p) {
      const pn = nest[p.r][p.c];
      const openings = openingCount(cells[p.r][p.c]);
      // Prefer lower nest; at nest 2 prefer corridor tips (1 opening)
      if (pn < MAX_WRONG_NEST) return pn * 10;
      if (openings === 1) return 20;
      return 30; // last resort: creates a nest-2 fork
    }

    // 2) Attach every remaining cell (full grid)
    let remaining = size * size - path.length;
    let safety = size * size * 5;
    while (remaining > 0 && safety-- > 0) {
      const frontier = [];
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (carved[r][c]) continue;
          if (carvedNeighbors(r, c).length) frontier.push({ r, c });
        }
      }
      if (!frontier.length) break;
      shuffle(frontier, rnd);
      // Prefer cells that can attach without creating a nest-2 fork
      const soft = frontier.filter((cell) =>
        carvedNeighbors(cell.r, cell.c).some((p) => rankParent(p) < 30)
      );
      const pool = soft.length ? soft : frontier;
      const cell = pool[0];
      const parents = carvedNeighbors(cell.r, cell.c);
      parents.sort((a, b) => rankParent(a) - rankParent(b) || rnd() - 0.5);
      const bestRank = rankParent(parents[0]);
      const top = parents.filter((p) => rankParent(p) === bestRank);
      const parent = top[Math.floor(rnd() * top.length)];
      const pn = nest[parent.r][parent.c];
      const childNest = pn < MAX_WRONG_NEST ? pn + 1 : MAX_WRONG_NEST;
      carveEdge(parent, cell);
      carved[cell.r][cell.c] = true;
      nest[cell.r][cell.c] = childNest;
      remaining--;
    }

    if (remaining > 0) {
      throw new Error('maze generation left uncarved cells');
    }

    return { size, cells, nest, start, goal };
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

  function solutionCells(maze) {
    const { size, cells, start, goal } = maze;
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
    const on = new Set();
    let cur = { r: goal.r, c: goal.c };
    while (cur) {
      on.add(`${cur.r},${cur.c}`);
      if (cur.r === start.r && cur.c === start.c) break;
      cur = prev[cur.r][cur.c];
    }
    return on;
  }

  function mazeStats(maze) {
    const { size, cells, start, nest } = maze;
    const onSol = solutionCells(maze);
    let deadEnds = 0;
    let junctions = 0;
    let solutionJunctions = 0;
    let solutionLength = 0;
    let wrongMaxDepth = 0;
    let wrongMaxNest = 0;
    let wrongForkNest = 0;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const o = openingCount(cells[r][c]);
        if (o === 1) deadEnds++;
        if (o >= 3) {
          junctions++;
          if (onSol.has(`${r},${c}`)) solutionJunctions++;
        }
        if (nest) wrongMaxNest = Math.max(wrongMaxNest, nest[r][c]);
      }
    }

    for (const key of onSol) {
      if (key === `${start.r},${start.c}`) continue;
      solutionLength++;
    }

    for (const key of onSol) {
      const [r0, c0] = key.split(',').map(Number);
      for (const dir of DIRS) {
        if (cells[r0][c0] & BITS[dir]) continue;
        const [dr, dc] = DELTA[dir];
        const nr = r0 + dr;
        const nc = c0 + dc;
        if (onSol.has(`${nr},${nc}`)) continue;
        const q = [{ r: nr, c: nc, depth: 1, forkDepth: 0 }];
        const seen = new Set([`${nr},${nc}`]);
        while (q.length) {
          const { r, c, depth, forkDepth } = q.shift();
          wrongMaxDepth = Math.max(wrongMaxDepth, depth);
          const o = openingCount(cells[r][c]);
          const nextFork = o >= 3 ? forkDepth + 1 : forkDepth;
          wrongForkNest = Math.max(wrongForkNest, nextFork);
          for (const d2 of DIRS) {
            if (cells[r][c] & BITS[d2]) continue;
            const [dr2, dc2] = DELTA[d2];
            const r2 = r + dr2;
            const c2 = c + dc2;
            const k = `${r2},${c2}`;
            if (onSol.has(k) || seen.has(k)) continue;
            seen.add(k);
            q.push({ r: r2, c: c2, depth: depth + 1, forkDepth: nextFork });
          }
        }
      }
    }

    return {
      deadEnds,
      junctions,
      solutionLength,
      solutionJunctions,
      wrongMaxDepth,
      wrongMaxNest,
      wrongForkNest,
    };
  }

  return {
    generateMaze,
    tryMove,
    isAtGoal,
    countPaths,
    mazeStats,
    WALL: { N, E, S, W },
    MAX_WRONG_NEST,
  };
});
