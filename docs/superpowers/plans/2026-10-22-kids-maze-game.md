# Kids Maze Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a touch-first, single-page maze game for ~5-year-olds with three themed levels (10×10 / 15×15 / 20×20), one success path each, and big on-screen direction buttons.

**Architecture:** Static HTML/CSS/JS with no build step. Pure maze logic lives in `js/maze-core.js` (generate perfect mazes, move, win, path-count) so Node can test it. `levels.js` holds theme metadata + fixed seeds. `render.js` paints a DOM grid of rooms with CSS borders as walls. `main.js` owns screens, input, celebration, and `localStorage` clears.

**Tech Stack:** HTML5, CSS3 (custom properties per theme), vanilla JS (classic `<script>` tags for `file://` compatibility), Node `assert` for logic tests (no npm framework required).

## Global Constraints

- Platform: mobile/tablet portrait first; large touch targets for direction keys
- Copy language: Chinese only (奇妙迷宫、开始、重来、返回、太棒了、下一关、再玩一次)
- Levels: 森林小动物 10×10, 海底冒险 15×15, 星空火箭 20×20
- Characters: 小狐狸 / 小海龟 / 小火箭; goals: 树洞小窝 / 闪亮贝壳 / 亮晶晶星球
- Exactly one path start→end per level (perfect maze / spanning tree)
- Move: one cell per direction tap; bump = shake, no penalty
- No timer, no lives, no sound, no network, no build step
- Open `index.html` in a browser to play (prefer local static server if `file://` quirks appear; scripts must still work as plain tags)

## File Structure

```
/
├── index.html              # screens: home, select, play, win overlay
├── css/style.css           # layout, themes, D-pad, celebration
├── js/maze-core.js         # generateMaze, tryMove, isAtGoal, countPaths
├── js/levels.js            # LEVELS array (id, size, seed, theme tokens)
├── js/render.js            # mountGrid, updatePlayer, setTheme, bumpShake
├── js/main.js              # navigation, input, localStorage, win flow
├── tests/maze-core.test.js # Node assert tests
└── docs/superpowers/...
```

---

### Task 1: Maze core — generate, move, unique path

**Files:**
- Create: `js/maze-core.js`
- Create: `tests/maze-core.test.js`

**Interfaces:**
- Consumes: none
- Produces:
  - `generateMaze(size, seed) → { size, cells, start: {r,c}, goal: {r,c} }`
    - `cells[r][c]` is bitfield: `1=N, 2=E, 4=S, 8=W` wall present
  - `tryMove(maze, pos, dir) → { pos, moved, bumped }` where `dir` ∈ `'N'|'E'|'S'|'W'`
  - `isAtGoal(maze, pos) → boolean`
  - `countPaths(maze) → number` (BFS/DFS count of distinct routes start→goal; must be 1 for perfect mazes)
  - Dual export: `globalThis.MazeCore = {...}` and `module.exports` when `typeof module !== 'undefined'`

- [ ] **Step 1: Write the failing test file**

Create `tests/maze-core.test.js`:

```js
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
```

- [ ] **Step 2: Run test — expect fail**

Run: `node tests/maze-core.test.js`  
Expected: `Cannot find module '../js/maze-core.js'` (or similar)

- [ ] **Step 3: Implement `js/maze-core.js`**

```js
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
```

- [ ] **Step 4: Run tests — expect pass**

Run: `node tests/maze-core.test.js`  
Expected: `All maze-core tests passed.`

- [ ] **Step 5: Commit**

```bash
git add js/maze-core.js tests/maze-core.test.js
git commit -m "feat: add maze core with unique-path generation"
```

---

### Task 2: Level definitions

**Files:**
- Create: `js/levels.js`

**Interfaces:**
- Consumes: `MazeCore.generateMaze`
- Produces: `globalThis.LEVELS` — array of:
  ```js
  {
    id: 'forest' | 'ocean' | 'space',
    title: string,          // 森林小动物 etc.
    size: 10 | 15 | 20,
    seed: number,
    theme: string,          // CSS data-theme value
    playerEmoji: string,
    goalEmoji: string,
    maze: <return of generateMaze>  // baked at load
  }
  ```

- [ ] **Step 1: Add a uniqueness smoke test for LEVELS seeds**

Append to `tests/maze-core.test.js` (or create `tests/levels.test.js`):

```js
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
```

- [ ] **Step 2: Run — expect fail** (`LEVELS is not defined` / cannot find levels.js)

- [ ] **Step 3: Implement `js/levels.js`**

```js
(function (root) {
  const { generateMaze } = root.MazeCore;
  const LEVELS = [
    {
      id: 'forest',
      title: '森林小动物',
      size: 10,
      seed: 20261022,
      theme: 'forest',
      playerEmoji: '🦊',
      goalEmoji: '🏠',
    },
    {
      id: 'ocean',
      title: '海底冒险',
      size: 15,
      seed: 20261023,
      theme: 'ocean',
      playerEmoji: '🐢',
      goalEmoji: '🐚',
    },
    {
      id: 'space',
      title: '星空火箭',
      size: 20,
      seed: 20261024,
      theme: 'space',
      playerEmoji: '🚀',
      goalEmoji: '🪐',
    },
  ].map((meta) => ({
    ...meta,
    maze: generateMaze(meta.size, meta.seed),
  }));

  root.LEVELS = LEVELS;
  if (typeof module !== 'undefined' && module.exports) module.exports = LEVELS;
})(typeof globalThis !== 'undefined' ? globalThis : this);
```

If `countPaths` is slow on 20×20 in DFS with backtracking over a tree it should still be 1 path and finish quickly (tree has no cycles in visited sense — wait, our DFS allows exploring the full tree which is O(cells) for a perfect maze if we don't revisit; with `seen` toggle backtracking on a tree there is exactly one route so count finishes fast). Keep as-is.

- [ ] **Step 4: Run** `node tests/levels.test.js` — expect `All levels tests passed.`

- [ ] **Step 5: Commit**

```bash
git add js/levels.js tests/levels.test.js tests/maze-core.test.js
git commit -m "feat: define three themed maze levels with fixed seeds"
```

---

### Task 3: HTML shell + theme CSS + render

**Files:**
- Create: `index.html`
- Create: `css/style.css`
- Create: `js/render.js`

**Interfaces:**
- Consumes: `LEVELS`, maze cell bitfields `MazeCore.WALL`
- Produces:
  - `Render.mountGrid(container, maze, level) → void`
  - `Render.updatePlayer(prev, next) → void`
  - `Render.setTheme(theme) → void` (sets `data-theme` on `<body>`)
  - `Render.bumpPlayer() → void` (adds `.bump` class briefly)
  - `Render.showWin(visible) → void`

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>奇妙迷宫</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body data-theme="forest">
  <div id="app">
    <section id="screen-home" class="screen active">
      <h1 class="brand">奇妙迷宫</h1>
      <p class="tagline">选一个主题，走到终点吧</p>
      <button type="button" id="btn-start" class="btn primary">开始</button>
    </section>

    <section id="screen-select" class="screen">
      <h2>选关</h2>
      <div id="level-cards" class="cards"></div>
      <button type="button" id="btn-back-home" class="btn ghost">返回</button>
    </section>

    <section id="screen-play" class="screen">
      <header class="play-bar">
        <button type="button" id="btn-back-select" class="btn ghost">返回</button>
        <h2 id="play-title"></h2>
        <button type="button" id="btn-restart" class="btn ghost">重来</button>
      </header>
      <div id="maze" class="maze" aria-label="迷宫"></div>
      <div class="dpad" aria-label="方向键">
        <button type="button" class="btn dpad-btn" data-dir="N" aria-label="上">▲</button>
        <div class="dpad-mid">
          <button type="button" class="btn dpad-btn" data-dir="W" aria-label="左">◀</button>
          <button type="button" class="btn dpad-btn" data-dir="E" aria-label="右">▶</button>
        </div>
        <button type="button" class="btn dpad-btn" data-dir="S" aria-label="下">▼</button>
      </div>
      <div id="win-overlay" class="win-overlay hidden" role="dialog" aria-modal="true">
        <div class="win-card">
          <div class="fx" aria-hidden="true">⭐ 🎈 ⭐</div>
          <p class="win-text">太棒了！</p>
          <button type="button" id="btn-next" class="btn primary">下一关</button>
          <button type="button" id="btn-again" class="btn">再玩一次</button>
        </div>
      </div>
    </section>
  </div>

  <script src="js/maze-core.js"></script>
  <script src="js/levels.js"></script>
  <script src="js/render.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `css/style.css`** with kid-friendly themes (not purple-saas defaults)

Use soft grass / ocean / indigo starry palettes; round buttons; D-pad min 64×64px; maze fills remaining width with `aspect-ratio: 1` and CSS grid. Key pieces:

```css
:root {
  --bg: #e8f5d8;
  --ink: #2a3b1f;
  --accent: #f0a83a;
  --wall: #6b8f4e;
  --path: #fff8e7;
  --btn: #ffd66b;
  --radius: 20px;
  font-family: "Nunito", "PingFang SC", "Hiragino Sans GB", sans-serif;
}
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&display=swap');

body[data-theme="forest"] { --bg: #e8f5d8; --ink: #2a3b1f; --wall: #6b8f4e; --path: #fff8e7; --accent: #f0a83a; }
body[data-theme="ocean"]  { --bg: #d9f1f7; --ink: #1a3a4a; --wall: #3aa0b8; --path: #eefcff; --accent: #ff8fab; }
body[data-theme="space"]  { --bg: #1b2340; --ink: #f2e9ff; --wall: #6b5b95; --path: #2a3358; --accent: #ffd36a; }

body { margin: 0; background: radial-gradient(circle at 20% 20%, #fff6, transparent 40%), var(--bg); color: var(--ink); min-height: 100dvh; }
.screen { display: none; padding: 1.25rem; max-width: 480px; margin: 0 auto; }
.screen.active { display: flex; flex-direction: column; gap: 1rem; min-height: 100dvh; box-sizing: border-box; }
.brand { font-size: clamp(2.4rem, 10vw, 3.2rem); margin: 2rem 0 0.5rem; text-align: center; }
.btn { min-height: 52px; min-width: 52px; border: none; border-radius: var(--radius); background: var(--btn); color: var(--ink); font-size: 1.15rem; font-weight: 800; touch-action: manipulation; }
.btn.primary { background: var(--accent); }
.btn.ghost { background: transparent; border: 3px solid color-mix(in srgb, var(--ink) 25%, transparent); }
.cards { display: flex; flex-direction: column; gap: 0.75rem; }
.card { text-align: left; padding: 1rem 1.1rem; border-radius: var(--radius); background: var(--path); border: 3px solid color-mix(in srgb, var(--wall) 55%, transparent); font-size: 1.2rem; position: relative; }
.card .check { position: absolute; right: 12px; top: 12px; }
.maze { display: grid; width: min(92vw, 420px); aspect-ratio: 1; margin: 0 auto; background: var(--wall); border-radius: 12px; overflow: hidden; box-shadow: inset 0 0 0 3px color-mix(in srgb, var(--ink) 12%, transparent); }
.cell { position: relative; background: var(--path); box-sizing: border-box; border-style: solid; border-color: var(--wall); border-width: 0; }
.cell.player::after, .cell.goal::before { position: absolute; inset: 0; display: grid; place-items: center; font-size: clamp(10px, 3.2vw, 22px); }
.cell.goal::before { content: attr(data-goal); }
.cell.player::after { content: attr(data-player); z-index: 1; }
.cell.player.bump { animation: bump 0.28s ease; }
@keyframes bump { 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
.dpad { display: grid; justify-items: center; gap: 0.35rem; margin-top: auto; padding-bottom: 1rem; }
.dpad-mid { display: flex; gap: 2.5rem; }
.dpad-btn { width: 72px; height: 72px; font-size: 1.6rem; border-radius: 18px; background: var(--accent); }
.win-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.35); display: grid; place-items: center; }
.win-overlay.hidden { display: none; }
.win-card { background: var(--path); color: var(--ink); padding: 1.5rem; border-radius: 24px; text-align: center; display: flex; flex-direction: column; gap: 0.75rem; min-width: 240px; }
.play-bar { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
.play-bar h2 { font-size: 1.1rem; margin: 0; text-align: center; flex: 1; }
@media (prefers-reduced-motion: reduce) {
  .cell.player.bump { animation: none; }
}
```

Border widths on `.cell` are set inline by `render.js` from wall bits (e.g. `borderTopWidth = walls&N ? 2 : 0`).

- [ ] **Step 3: Implement `js/render.js`**

```js
(function (root) {
  const { N, E, S, W } = root.MazeCore.WALL;
  let mazeEl = null;
  let levelMeta = null;

  function cellEl(r, c) {
    return mazeEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
  }

  function mountGrid(container, maze, level) {
    mazeEl = container;
    levelMeta = level;
    container.style.gridTemplateColumns = `repeat(${maze.size}, 1fr)`;
    container.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (let r = 0; r < maze.size; r++) {
      for (let c = 0; c < maze.size; c++) {
        const div = document.createElement('div');
        div.className = 'cell';
        div.dataset.r = r;
        div.dataset.c = c;
        const walls = maze.cells[r][c];
        div.style.borderTopWidth = walls & N ? '2px' : '0';
        div.style.borderRightWidth = walls & E ? '2px' : '0';
        div.style.borderBottomWidth = walls & S ? '2px' : '0';
        div.style.borderLeftWidth = walls & W ? '2px' : '0';
        if (r === maze.goal.r && c === maze.goal.c) {
          div.classList.add('goal');
          div.dataset.goal = level.goalEmoji;
        }
        frag.appendChild(div);
      }
    }
    container.appendChild(frag);
    updatePlayer(null, maze.start);
  }

  function updatePlayer(prev, next) {
    if (prev) {
      const p = cellEl(prev.r, prev.c);
      if (p) {
        p.classList.remove('player', 'bump');
        delete p.dataset.player;
      }
    }
    const n = cellEl(next.r, next.c);
    if (n) {
      n.classList.add('player');
      n.dataset.player = levelMeta.playerEmoji;
    }
  }

  function setTheme(theme) {
    document.body.dataset.theme = theme;
  }

  function bumpPlayer() {
    const el = mazeEl.querySelector('.cell.player');
    if (!el) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  }

  function showWin(visible) {
    document.getElementById('win-overlay').classList.toggle('hidden', !visible);
  }

  root.Render = { mountGrid, updatePlayer, setTheme, bumpPlayer, showWin };
})(typeof globalThis !== 'undefined' ? globalThis : this);
```

- [ ] **Step 4: Manual check** — open `index.html` (or `npx --yes serve .`) and confirm home screen paints; console has no script errors once `main.js` stub exists. For this task only, add temporary stub:

```js
// js/main.js temporary stub — replaced in Task 4
console.log('levels', LEVELS.length);
```

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css js/render.js js/main.js
git commit -m "feat: add HTML shell, themes, and maze DOM renderer"
```

---

### Task 4: Game flow, controls, win, localStorage

**Files:**
- Modify: `js/main.js` (replace stub)
- Modify: `index.html` only if IDs missing (should not need)

**Interfaces:**
- Consumes: `LEVELS`, `MazeCore.tryMove`, `MazeCore.isAtGoal`, `Render.*`
- Produces: working app — home → select → play → win → next/again; clears key `kids-maze-cleared` = JSON string array of level ids

- [ ] **Step 1: Implement full `js/main.js`**

```js
(function () {
  const STORAGE_KEY = 'kids-maze-cleared';
  let levelIndex = 0;
  let pos = { r: 0, c: 0 };
  let inputLocked = false;

  const screens = {
    home: document.getElementById('screen-home'),
    select: document.getElementById('screen-select'),
    play: document.getElementById('screen-play'),
  };

  function show(name) {
    Object.values(screens).forEach((el) => el.classList.remove('active'));
    screens[name].classList.add('active');
  }

  function getCleared() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function markCleared(id) {
    const set = new Set(getCleared());
    set.add(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  }

  function renderCards() {
    const host = document.getElementById('level-cards');
    const cleared = new Set(getCleared());
    host.innerHTML = '';
    LEVELS.forEach((level, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'card';
      btn.innerHTML = `${level.playerEmoji} ${level.title}<br><small>${level.size}×${level.size}</small>${
        cleared.has(level.id) ? '<span class="check">✅</span>' : ''
      }`;
      btn.addEventListener('click', () => startLevel(i));
      host.appendChild(btn);
    });
  }

  function startLevel(i) {
    levelIndex = i;
    const level = LEVELS[i];
    pos = { ...level.maze.start };
    inputLocked = false;
    Render.setTheme(level.theme);
    Render.showWin(false);
    document.getElementById('play-title').textContent = level.title;
    Render.mountGrid(document.getElementById('maze'), level.maze, level);
    show('play');
  }

  function restart() {
    startLevel(levelIndex);
  }

  function move(dir) {
    if (inputLocked) return;
    const level = LEVELS[levelIndex];
    const result = MazeCore.tryMove(level.maze, pos, dir);
    if (result.bumped) {
      Render.bumpPlayer();
      return;
    }
    const prev = pos;
    pos = result.pos;
    Render.updatePlayer(prev, pos);
    if (MazeCore.isAtGoal(level.maze, pos)) {
      inputLocked = true;
      markCleared(level.id);
      Render.showWin(true);
    }
  }

  function nextLevel() {
    if (levelIndex < LEVELS.length - 1) startLevel(levelIndex + 1);
    else {
      renderCards();
      show('select');
    }
  }

  document.getElementById('btn-start').addEventListener('click', () => {
    renderCards();
    show('select');
  });
  document.getElementById('btn-back-home').addEventListener('click', () => show('home'));
  document.getElementById('btn-back-select').addEventListener('click', () => {
    Render.showWin(false);
    renderCards();
    show('select');
  });
  document.getElementById('btn-restart').addEventListener('click', restart);
  document.getElementById('btn-again').addEventListener('click', restart);
  document.getElementById('btn-next').addEventListener('click', nextLevel);

  document.querySelectorAll('.dpad-btn').forEach((btn) => {
    btn.addEventListener('click', () => move(btn.dataset.dir));
  });

  const keyMap = {
    ArrowUp: 'N',
    ArrowDown: 'S',
    ArrowLeft: 'W',
    ArrowRight: 'E',
  };
  window.addEventListener('keydown', (e) => {
    const dir = keyMap[e.key];
    if (!dir) return;
    if (!screens.play.classList.contains('active')) return;
    e.preventDefault();
    move(dir);
  });

  show('home');
})();
```

- [ ] **Step 2: Manual playtest checklist**

1. Open via `npx --yes serve .` (or double-click `index.html`).
2. 开始 → 三张关卡卡可见，尺寸标注 10/15/20。
3. 进森林关：方向键移动；撞墙晃动；重来回起点。
4. 走到终点：出现「太棒了！」；下一关进入海底；返回选关后森林有 ✅。
5. 键盘方向键在桌面可用。
6. Re-run: `node tests/maze-core.test.js && node tests/levels.test.js`

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: wire screens, D-pad controls, win flow, and clear marks"
```

---

### Task 5: Polish pass + README

**Files:**
- Create: `README.md`
- Modify: `css/style.css` if playtest found overflow/D-pad issues on narrow phones
- Modify: `docs/superpowers/specs/2026-10-22-kids-maze-game-design.md` — set status to「已确认，实现中/已实现」

- [ ] **Step 1: Write `README.md`**

```markdown
# 奇妙迷宫

写给五岁孩子的主题迷宫小游戏（手机/平板触屏）。

## 怎么玩

用手机浏览器打开 `index.html`，或在项目目录运行：

```bash
npx --yes serve .
```

点「开始」选关，用屏幕下方方向键走到终点。

## 关卡

| 主题 | 尺寸 |
|------|------|
| 森林小动物 | 10×10 |
| 海底冒险 | 15×15 |
| 星空火箭 | 20×20 |

## 测试

```bash
node tests/maze-core.test.js
node tests/levels.test.js
```
```

- [ ] **Step 2: Fix any layout bugs found in Task 4 playtest** (keep changes minimal: spacing, font-size on 20×20 emoji, safe-area padding).

- [ ] **Step 3: Update spec status line** to `状态：已实现（第一版）`

- [ ] **Step 4: Final verification**

```bash
node tests/maze-core.test.js && node tests/levels.test.js
```

Expected: both print passed messages.

- [ ] **Step 5: Commit**

```bash
git add README.md css/style.css docs/superpowers/specs/2026-10-22-kids-maze-game-design.md
git commit -m "docs: add README and mark maze game v1 complete"
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| Home / select / play / win flow | 3, 4 |
| Three themes + emojis | 2, 3 |
| 10 / 15 / 20 sizes | 2 |
| Unique path | 1, 2 tests |
| D-pad + keyboard | 4 |
| Bump on wall, no penalty | 4 |
| Celebration + next/again | 3, 4 |
| localStorage clear marks | 4 |
| DOM grid + CSS themes | 3 |
| No sound / no build | all |
| Mobile-first CSS | 3, 5 |

**Placeholder scan:** none intentional.  
**Type consistency:** `tryMove` / `generateMaze` / `LEVELS` / `Render.*` names aligned across tasks.
