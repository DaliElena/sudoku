const Validator = (() => {

  function getConflicts(grid) {
    const conflicts = new Set();
    const mark = (r, c) => conflicts.add(`${r},${c}`);

    for (let i = 0; i < 9; i++) {
      _checkGroup(grid, _row(i), mark);
      _checkGroup(grid, _col(i), mark);
    }
    for (let br = 0; br < 3; br++) {
      for (let bc = 0; bc < 3; bc++) {
        _checkGroup(grid, _block(br, bc), mark);
      }
    }

    return [...conflicts].map(key => {
      const [r, c] = key.split(',').map(Number);
      return { row: r, col: c };
    });
  }

  function _row(r)  { return Array.from({length:9}, (_,c) => [r,c]); }
  function _col(c)  { return Array.from({length:9}, (_,r) => [r,c]); }
  function _block(br,bc) {
    const cells = [];
    for(let r=br*3;r<br*3+3;r++) for(let c=bc*3;c<bc*3+3;c++) cells.push([r,c]);
    return cells;
  }

  function _checkGroup(grid, cells, mark) {
    const seen = {};
    for (const [r,c] of cells) {
      const v = grid[r][c];
      if (!v) continue;
      if (seen[v] !== undefined) { mark(r,c); mark(...seen[v]); }
      else seen[v] = [r,c];
    }
  }

  function isSolved(grid, solution) {
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (grid[r][c] !== solution[r][c]) return false;
    return true;
  }

  return { getConflicts, isSolved };
})();
