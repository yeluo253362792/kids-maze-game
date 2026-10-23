(function () {
  const STORAGE_KEY = 'kids-maze-cleared';
  const WIN_COUNTDOWN_SEC = 3;
  let levelIndex = 0;
  let pos = { r: 0, c: 0 };
  let inputLocked = false;
  let wired = false;
  let winTimer = null;
  let winRemain = 0;

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
    const frag = document.createDocumentFragment();
    LEVELS.forEach((level, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'level-tile' + (cleared.has(level.id) ? ' cleared' : '');
      btn.setAttribute('role', 'listitem');
      btn.setAttribute(
        'aria-label',
        `${i + 1}. ${level.title}${cleared.has(level.id) ? '，已通关' : ''}`
      );
      btn.title = level.title;
      btn.innerHTML =
        `<span class="tile-emoji" aria-hidden="true">${level.playerEmoji}</span>` +
        `<span class="tile-num">${i + 1}</span>`;
      btn.addEventListener('click', () => startLevel(i));
      frag.appendChild(btn);
    });
    host.appendChild(frag);
  }

  function startLevel(i) {
    clearWinTimer();
    levelIndex = i;
    const level = LEVELS[i];
    const maze = ensureMaze(level);
    pos = { ...maze.start };
    inputLocked = false;
    Render.setTheme(level.theme, level.colors || null);
    Render.showWin(false);
    document.getElementById('play-title').textContent = level.title;
    Render.mountGrid(document.getElementById('maze'), maze, level);
    show('play');
  }

  function restart() {
    clearWinTimer();
    startLevel(levelIndex);
  }

  function clearWinTimer() {
    if (winTimer) {
      clearInterval(winTimer);
      winTimer = null;
    }
    winRemain = 0;
  }

  function updateWinCountdown() {
    const el = document.getElementById('win-countdown');
    if (!el) return;
    const hasNext = levelIndex < LEVELS.length - 1;
    if (!hasNext) {
      el.textContent = '全部通关啦！';
      el.classList.remove('is-last');
      return;
    }
    el.textContent =
      winRemain > 0 ? `${winRemain} 秒后进入下一关` : '正在进入下一关…';
    el.classList.toggle('is-last', winRemain <= 1);
  }

  function startWinCountdown() {
    clearWinTimer();
    const hasNext = levelIndex < LEVELS.length - 1;
    winRemain = hasNext ? WIN_COUNTDOWN_SEC : 0;
    updateWinCountdown();
    if (!hasNext) return;
    winTimer = setInterval(() => {
      winRemain -= 1;
      updateWinCountdown();
      if (winRemain <= 0) {
        clearWinTimer();
        nextLevel();
      }
    }, 1000);
  }

  function goHome() {
    clearWinTimer();
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
      startWinCountdown();
    }
  }

  function nextLevel() {
    clearWinTimer();
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
