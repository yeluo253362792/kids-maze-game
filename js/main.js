(function () {
  const STORAGE_KEY = 'kids-maze-cleared';
  let levelIndex = 0;
  let pos = { r: 0, c: 0 };
  let inputLocked = false;
  let wired = false;

  const screens = {
    home: document.getElementById('screen-home'),
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
      const nestLabel = level.maxNest <= 2 ? '分叉浅' : '分叉稍深';
      btn.innerHTML = `${level.playerEmoji} ${level.title}<br><small>${level.size}×${level.size} · ${nestLabel}</small>${
        cleared.has(level.id) ? '<span class="check">✅</span>' : ''
      }`;
      btn.addEventListener('click', () => startLevel(i));
      host.appendChild(btn);
    });
  }

  function startLevel(i) {
    levelIndex = i;
    const level = LEVELS[i];
    const maze = ensureMaze(level);
    pos = { ...maze.start };
    inputLocked = false;
    Render.setTheme(level.theme);
    Render.showWin(false);
    document.getElementById('play-title').textContent = level.title;
    Render.mountGrid(document.getElementById('maze'), maze, level);
    show('play');
  }

  function restart() {
    startLevel(levelIndex);
  }

  function goHome() {
    Render.showWin(false);
    renderCards();
    show('home');
  }

  function move(dir) {
    if (inputLocked) return;
    Sfx.unlock();
    const level = LEVELS[levelIndex];
    const result = MazeCore.tryMove(level.maze, pos, dir);
    if (result.bumped) {
      Render.bumpPlayer();
      Sfx.bump();
      return;
    }
    const prev = pos;
    pos = result.pos;
    Render.updatePlayer(prev, pos);
    Sfx.step();
    if (MazeCore.isAtGoal(level.maze, pos)) {
      inputLocked = true;
      markCleared(level.id);
      Render.showWin(true);
      Sfx.win();
    }
  }

  function nextLevel() {
    if (levelIndex < LEVELS.length - 1) startLevel(levelIndex + 1);
    else goHome();
  }

  function wireOnce() {
    if (wired) return;
    wired = true;

    document.getElementById('btn-back-home').addEventListener('click', goHome);
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
  }

  function openHome() {
    wireOnce();
    Sfx.unlock();
    renderCards();
    show('home');
  }

  window.MazeGame = { openHome };
})();
