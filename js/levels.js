(function (root) {
  const data = root.MAZES_DATA;
  if (!data) {
    throw new Error('MAZES_DATA missing — load js/mazes-data.js first (or run node scripts/bake-mazes.js)');
  }

  const LEVELS = [
    {
      id: 'forest',
      title: '森林小动物',
      size: 10,
      seed: 120,
      maxNest: 2,
      theme: 'forest',
      playerEmoji: '🦊',
      goalEmoji: '🏠',
    },
    {
      id: 'ocean',
      title: '海底冒险',
      size: 15,
      seed: 102,
      maxNest: 2,
      theme: 'ocean',
      playerEmoji: '🐢',
      goalEmoji: '🐚',
    },
    {
      id: 'space',
      title: '星空火箭',
      size: 20,
      seed: 23,
      maxNest: 2,
      theme: 'space',
      playerEmoji: '🚀',
      goalEmoji: '🪐',
    },
    {
      id: 'candy',
      title: '糖果王国',
      size: 15,
      seed: 46,
      maxNest: 2,
      theme: 'candy',
      playerEmoji: '🍬',
      goalEmoji: '🍭',
    },
    {
      id: 'dino',
      title: '恐龙乐园',
      size: 15,
      seed: 62,
      maxNest: 3,
      theme: 'dino',
      playerEmoji: '🦕',
      goalEmoji: '🥚',
    },
    {
      id: 'farm',
      title: '开心农场',
      size: 15,
      seed: 2,
      maxNest: 2,
      theme: 'farm',
      playerEmoji: '🐑',
      goalEmoji: '🌾',
    },
    {
      id: 'pirate',
      title: '海盗寻宝',
      size: 20,
      seed: 16,
      maxNest: 2,
      theme: 'pirate',
      playerEmoji: '🏴‍☠️',
      goalEmoji: '💎',
    },
    {
      id: 'snow',
      title: '雪地小屋',
      size: 20,
      seed: 8,
      maxNest: 3,
      theme: 'snow',
      playerEmoji: '🐧',
      goalEmoji: '⛄',
    },
    {
      id: 'volcano',
      title: '火山探险',
      size: 20,
      seed: 30,
      maxNest: 2,
      theme: 'volcano',
      playerEmoji: '🦎',
      goalEmoji: '🌋',
    },
    {
      id: 'garden',
      title: '蝴蝶花园',
      size: 25,
      seed: 26,
      maxNest: 2,
      theme: 'garden',
      playerEmoji: '🦋',
      goalEmoji: '🌸',
    },
    {
      id: 'train',
      title: '小火车',
      size: 25,
      seed: 11,
      maxNest: 3,
      theme: 'train',
      playerEmoji: '🚂',
      goalEmoji: '🚉',
    },
    {
      id: 'castle',
      title: '城堡骑士',
      size: 25,
      seed: 50,
      maxNest: 2,
      theme: 'castle',
      playerEmoji: '🐴',
      goalEmoji: '🏰',
    },
    {
      id: 'desert',
      title: '沙漠绿洲',
      size: 30,
      seed: 58,
      maxNest: 2,
      theme: 'desert',
      playerEmoji: '🐪',
      goalEmoji: '🌴',
    },
    {
      id: 'rainbow',
      title: '彩虹滑梯',
      size: 30,
      seed: 34,
      maxNest: 3,
      theme: 'rainbow',
      playerEmoji: '🦄',
      goalEmoji: '🌈',
    },
    {
      id: 'moon',
      title: '月亮兔子',
      size: 30,
      seed: 31,
      maxNest: 2,
      theme: 'moon',
      playerEmoji: '🐰',
      goalEmoji: '🌙',
    },
  ].map((meta) => {
    const baked = data[meta.id];
    if (!baked) throw new Error('missing baked maze for ' + meta.id);
    return {
      ...meta,
      maze: {
        size: baked.size,
        cells: baked.cells,
        start: baked.start,
        goal: baked.goal,
        maxNest: baked.maxNest,
      },
    };
  });

  function ensureMaze(level) {
    return level.maze;
  }

  root.LEVELS = LEVELS;
  root.ensureMaze = ensureMaze;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LEVELS;
    module.exports.ensureMaze = ensureMaze;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
