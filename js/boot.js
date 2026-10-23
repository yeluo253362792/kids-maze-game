(function () {
  const GAME_SCRIPTS = [
    'js/maze-core.js',
    'js/mazes-data.js',
    'js/levels-catalog.js',
    'js/levels.js',
    'js/render.js',
    'js/sfx.js',
    'js/main.js',
  ];

  let loading = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('failed to load ' + src));
      document.body.appendChild(s);
    });
  }

  function setLoading(on, text) {
    const el = document.getElementById('loading-overlay');
    const label = el.querySelector('.loading-text');
    if (text) label.textContent = text;
    el.classList.toggle('hidden', !on);
  }

  function ensureGame() {
    if (window.MazeGame) return Promise.resolve();
    if (loading) return loading;
    setLoading(true, '加载中…');
    loading = GAME_SCRIPTS.reduce(
      (p, src) => p.then(() => loadScript(src)),
      Promise.resolve()
    )
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        loading = null;
        setLoading(false);
        console.error(err);
        alert('游戏加载失败，请刷新重试');
        throw err;
      });
    return loading;
  }

  ensureGame().then(() => {
    window.MazeGame.openHome();
  });
})();
