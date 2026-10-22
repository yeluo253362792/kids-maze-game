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
  const DEFAULT_MAX_WRONG_NEST = 2;

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

  function sealEdge(cells, a, b) {
    const d = dirBetween(a, b);
    cells[a.r][a.c] |= BITS[d];
    cells[b.r][b.c] |= OPP[d];
  }

  function carveEdge(cells, a, b) {
    const d = dirBetween(a, b);
    cells[a.r][a.c] &= ~BITS[d];
    cells[b.r][b.c] &= ~OPP[d];
  }

  function neighborsOpen(cells, size, r, c) {
    const list = [];
    for (const dir of DIRS) {
      if (cells[r][c] & BITS[dir]) continue;
      const [dr, dc] = DELTA[dir];
      list.push({ r: r + dr, c: c + dc });
    }
    return list;
  }

  function buildSolutionSet(maze) {
    const { size, cells, start, goal } = maze;
    const prev = Array.from({ length: size }, () => Array(size).fill(null));
    const seen = Array.from({ length: size }, () => Array(size).fill(false));
    const queue = [{ r: start.r, c: start.c }];
    seen[start.r][start.c] = true;
    while (queue.length) {
      const { r, c } = queue.shift();
      if (r === goal.r && c === goal.c) break;
      for (const nb of neighborsOpen(cells, size, r, c)) {
        if (seen[nb.r][nb.c]) continue;
        seen[nb.r][nb.c] = true;
        prev[nb.r][nb.c] = { r, c };
        queue.push(nb);
      }
    }
    const onSol = new Set();
    let cur = { r: goal.r, c: goal.c };
    while (cur) {
      onSol.add(`${cur.r},${cur.c}`);
      if (cur.r === start.r && cur.c === start.c) break;
      cur = prev[cur.r][cur.c];
    }
    return onSol;
  }

  /** BFS wrong-tree fork depths; returns max nest and per-cell visit depth. */
  function wrongForkInfo(maze, onSol) {
    const { size, cells } = maze;
    const visitFork = Array.from({ length: size }, () => Array(size).fill(-1));
    let maxNest = 0;
    const deepEdges = []; // {jr,jc, cr,cc, nestAtJunction}

    for (const key of onSol) {
      const [r0, c0] = key.split(',').map(Number);
      for (const nb of neighborsOpen(cells, size, r0, c0)) {
        if (onSol.has(`${nb.r},${nb.c}`)) continue;
        const q = [{ r: nb.r, c: nb.c, forkDepth: 0, from: { r: r0, c: c0 } }];
        const seen = new Set([`${nb.r},${nb.c}`]);
        while (q.length) {
          const { r, c, forkDepth, from } = q.shift();
          visitFork[r][c] = Math.max(visitFork[r][c], forkDepth);
          const o = openingCount(cells[r][c]);
          const nextFork = o >= 3 ? forkDepth + 1 : forkDepth;
          maxNest = Math.max(maxNest, nextFork);
          if (o >= 3 && nextFork > 0) {
            for (const ch of neighborsOpen(cells, size, r, c)) {
              if (ch.r === from.r && ch.c === from.c) continue;
              if (onSol.has(`${ch.r},${ch.c}`)) continue;
              deepEdges.push({
                jr: r,
                jc: c,
                cr: ch.r,
                cc: ch.c,
                nestAtJunction: nextFork,
              });
            }
          }
          for (const ch of neighborsOpen(cells, size, r, c)) {
            const k = `${ch.r},${ch.c}`;
            if (onSol.has(k) || seen.has(k)) continue;
            if (ch.r === from.r && ch.c === from.c) continue;
            seen.add(k);
            q.push({ r: ch.r, c: ch.c, forkDepth: nextFork, from: { r, c } });
          }
        }
      }
    }
    return { maxNest, visitFork, deepEdges };
  }

  function componentOf(cells, size, root, blockedEdge) {
    const set = new Set();
    const q = [root];
    set.add(`${root.r},${root.c}`);
    while (q.length) {
      const cur = q.shift();
      for (const nb of neighborsOpen(cells, size, cur.r, cur.c)) {
        if (
          blockedEdge &&
          ((cur.r === blockedEdge.a.r &&
            cur.c === blockedEdge.a.c &&
            nb.r === blockedEdge.b.r &&
            nb.c === blockedEdge.b.c) ||
            (cur.r === blockedEdge.b.r &&
              cur.c === blockedEdge.b.c &&
              nb.r === blockedEdge.a.r &&
              nb.c === blockedEdge.a.c))
        ) {
          continue;
        }
        const k = `${nb.r},${nb.c}`;
        if (set.has(k)) continue;
        set.add(k);
        q.push(nb);
      }
    }
    return set;
  }

  function reduceWrongNesting(maze, maxNest, rnd) {
    const { size, cells } = maze;
    for (let iter = 0; iter < size * size * 20; iter++) {
      const onSol = buildSolutionSet(maze);
      const info = wrongForkInfo(maze, onSol);
      if (info.maxNest <= maxNest) return true;

      // Prefer cutting edges from the deepest junctions
      const candidates = info.deepEdges
        .filter((e) => e.nestAtJunction > maxNest)
        .sort((a, b) => b.nestAtJunction - a.nestAtJunction);
      const pool = candidates.length ? candidates : info.deepEdges;
      if (!pool.length) return false;
      shuffle(pool, rnd);

      let reduced = false;
      for (const edge of pool.slice(0, 40)) {
        const J = { r: edge.jr, c: edge.jc };
        const C = { r: edge.cr, c: edge.cc };
        sealEdge(cells, J, C);
        const comp = componentOf(cells, size, C, null);

        // Find reconnect: cell in comp adjacent to outside with shallow fork
        const borders = [];
        for (const key of comp) {
          const [r, c] = key.split(',').map(Number);
          for (const d of DIRS) {
            const [dr, dc] = DELTA[d];
            const nr = r + dr;
            const nc = c + dc;
            if (nr < 0 || nc < 0 || nr >= size || nc >= size) continue;
            if (comp.has(`${nr},${nc}`)) continue;
            // Outside cell
            let depth;
            if (onSol.has(`${nr},${nc}`)) depth = 0;
            else {
              const vf = info.visitFork[nr][nc];
              depth = vf < 0 ? maxNest + 1 : vf;
              // If outside is a junction, child would be depth+1
              if (openingCount(cells[nr][nc]) >= 2) depth = depth + 1;
            }
            if (depth <= maxNest) borders.push({ a: { r, c }, b: { r: nr, c: nc }, depth });
          }
        }
        if (!borders.length) {
          // Any geometric neighbor outside the component (keep spanning tree)
          for (const key of comp) {
            const [r, c] = key.split(',').map(Number);
            for (const d of DIRS) {
              const [dr, dc] = DELTA[d];
              const nr = r + dr;
              const nc = c + dc;
              if (nr < 0 || nc < 0 || nr >= size || nc >= size) continue;
              if (comp.has(`${nr},${nc}`)) continue;
              borders.push({ a: { r, c }, b: { r: nr, c: nc }, depth: 99 });
            }
          }
        }
        if (!borders.length) {
          carveEdge(cells, J, C); // revert
          continue;
        }
        borders.sort((a, b) => a.depth - b.depth || rnd() - 0.5);
        const pick = borders[0];
        carveEdge(cells, pick.a, pick.b);
        reduced = true;
        break;
      }
      if (!reduced) return false;
    }
    const onSol = buildSolutionSet(maze);
    return wrongForkInfo(maze, onSol).maxNest <= maxNest;
  }

  /**
   * Full-grid unique-path maze. Builds a Prim spanning tree, then rewires
   * wrong-path branches so fork nesting stays ≤ maxNest (2 or 3).
   */
  function generateMaze(size, seed, maxNest) {
    if (maxNest == null) maxNest = DEFAULT_MAX_WRONG_NEST;
    maxNest = Math.max(1, Math.min(6, maxNest | 0));
    const start = { r: 0, c: 0 };
    const goal = { r: size - 1, c: size - 1 };

    for (let attempt = 0; attempt < 48; attempt++) {
      const attemptSeed = (seed + attempt * 104729) >>> 0;
      const rnd = mulberry32(attemptSeed);
      const cells = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => N | E | S | W)
      );
      const inMaze = Array.from({ length: size }, () => Array(size).fill(false));
      const frontier = [];

      function addFrontier(r, c) {
        for (const dir of DIRS) {
          const [dr, dc] = DELTA[dir];
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nc < 0 || nr >= size || nc >= size) continue;
          if (inMaze[nr][nc]) continue;
          if (!frontier.some((f) => f.r === nr && f.c === nc)) frontier.push({ r: nr, c: nc });
        }
      }

      inMaze[0][0] = true;
      addFrontier(0, 0);
      while (frontier.length) {
        const i = Math.floor(rnd() * frontier.length);
        const { r, c } = frontier.splice(i, 1)[0];
        const neigh = [];
        for (const dir of DIRS) {
          const [dr, dc] = DELTA[dir];
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nc < 0 || nr >= size || nc >= size) continue;
          if (inMaze[nr][nc]) neigh.push(dir);
        }
        if (!neigh.length) continue;
        const dir = neigh[Math.floor(rnd() * neigh.length)];
        const [dr, dc] = DELTA[dir];
        cells[r][c] &= ~BITS[dir];
        cells[r + dr][c + dc] &= ~OPP[dir];
        inMaze[r][c] = true;
        addFrontier(r, c);
      }

      const maze = { size, cells, start, goal, maxNest };
      if (countPaths(maze) !== 1) continue;
      if (!reduceWrongNesting(maze, maxNest, rnd)) continue;
      if (countPaths(maze) !== 1) continue;
      const onSol = buildSolutionSet(maze);
      if (wrongForkInfo(maze, onSol).maxNest > maxNest) continue;
      return maze;
    }
    throw new Error('maze generation failed for nest cap');
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
    return buildSolutionSet(maze);
  }

  function mazeStats(maze) {
    const { size, cells, start } = maze;
    const onSol = buildSolutionSet(maze);
    let deadEnds = 0;
    let junctions = 0;
    let solutionJunctions = 0;
    let solutionLength = 0;
    let wrongMaxDepth = 0;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const o = openingCount(cells[r][c]);
        if (o === 1) deadEnds++;
        if (o >= 3) {
          junctions++;
          if (onSol.has(`${r},${c}`)) solutionJunctions++;
        }
      }
    }
    for (const key of onSol) {
      if (key === `${start.r},${start.c}`) continue;
      solutionLength++;
    }

    const info = wrongForkInfo(maze, onSol);
    for (const key of onSol) {
      const [r0, c0] = key.split(',').map(Number);
      for (const nb of neighborsOpen(cells, size, r0, c0)) {
        if (onSol.has(`${nb.r},${nb.c}`)) continue;
        const q = [{ r: nb.r, c: nb.c, depth: 1 }];
        const seen = new Set([`${nb.r},${nb.c}`]);
        while (q.length) {
          const { r, c, depth } = q.shift();
          wrongMaxDepth = Math.max(wrongMaxDepth, depth);
          for (const ch of neighborsOpen(cells, size, r, c)) {
            const k = `${ch.r},${ch.c}`;
            if (onSol.has(k) || seen.has(k)) continue;
            seen.add(k);
            q.push({ r: ch.r, c: ch.c, depth: depth + 1 });
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
      wrongMaxNest: info.maxNest,
      wrongForkNest: info.maxNest,
    };
  }

  return {
    generateMaze,
    tryMove,
    isAtGoal,
    countPaths,
    mazeStats,
    solutionCells,
    WALL: { N, E, S, W },
    DEFAULT_MAX_WRONG_NEST,
  };
});
