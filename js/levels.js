(function (root) {
  const data = root.MAZES_DATA;
  const catalog = root.LEVEL_CATALOG;
  if (!data) {
    throw new Error('MAZES_DATA missing — load js/mazes-data.js first (or run node scripts/bake-mazes.js)');
  }
  if (!catalog) {
    throw new Error('LEVEL_CATALOG missing — load js/levels-catalog.js first (or run node scripts/bake-mazes.js)');
  }

  const LEVELS = catalog.map((meta) => {
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
