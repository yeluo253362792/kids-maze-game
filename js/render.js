(function (root) {
  const { N, E, S, W } = root.MazeCore.WALL;
  let mazeEl = null;
  let levelMeta = null;
  let hostEl = null;
  let resizeObserver = null;

  function cellEl(r, c) {
    return mazeEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
  }

  function fitMaze() {
    if (!mazeEl || !hostEl) return;
    const side = Math.max(0, Math.floor(Math.min(hostEl.clientWidth, hostEl.clientHeight)));
    if (side <= 0) return;
    const px = `${side}px`;
    mazeEl.style.width = px;
    mazeEl.style.height = px;
    mazeEl.style.setProperty('--maze-side', px);
  }

  function watchHost(host) {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    hostEl = host;
    if (!host || typeof ResizeObserver === 'undefined') {
      fitMaze();
      return;
    }
    resizeObserver = new ResizeObserver(() => fitMaze());
    resizeObserver.observe(host);
    fitMaze();
  }

  function mountGrid(container, maze, level) {
    mazeEl = container;
    levelMeta = level;
    container.style.setProperty('--maze-n', String(maze.size));
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
    watchHost(container.parentElement);
    // Layout may settle after paint (flex chrome)
    requestAnimationFrame(() => {
      fitMaze();
      requestAnimationFrame(fitMaze);
    });
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

  root.Render = { mountGrid, updatePlayer, setTheme, bumpPlayer, showWin, fitMaze };
})(typeof globalThis !== 'undefined' ? globalThis : this);
