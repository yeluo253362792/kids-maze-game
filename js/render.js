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
