(function (root) {
  const { generateMaze } = root.MazeCore;
  const LEVELS = [
    {
      id: 'forest',
      title: '森林小动物',
      size: 10,
      seed: 1661,
      theme: 'forest',
      playerEmoji: '🦊',
      goalEmoji: '🏠',
    },
    {
      id: 'ocean',
      title: '海底冒险',
      size: 15,
      seed: 1717,
      theme: 'ocean',
      playerEmoji: '🐢',
      goalEmoji: '🐚',
    },
    {
      id: 'space',
      title: '星空火箭',
      size: 20,
      seed: 848,
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
