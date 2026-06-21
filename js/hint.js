const Hint = (() => {

  function _usedInRow(grid, r) {
    return new Set(grid[r].filter(v => v !== 0));
  }

  function _usedInCol(grid, c) {
    const s = new Set();
    for (let r = 0; r < 9; r++) if (grid[r][c] !== 0) s.add(grid[r][c]);
    return s;
  }

  function _usedInBox(grid, r, c) {
    const s = new Set();
    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (let dr = 0; dr < 3; dr++)
      for (let dc = 0; dc < 3; dc++)
        if (grid[br + dr][bc + dc] !== 0) s.add(grid[br + dr][bc + dc]);
    return s;
  }

  function _candidates(grid, r, c) {
    const used = new Set([
      ..._usedInRow(grid, r),
      ..._usedInCol(grid, c),
      ..._usedInBox(grid, r, c),
    ]);
    return [1,2,3,4,5,6,7,8,9].filter(n => !used.has(n));
  }

  // Возвращает наиболее «объяснимую» пустую клетку и почему туда идёт нужная цифра.
  // Приоритет: naked single (только один кандидат) → иначе просто подтверждаем правильную цифру.
  function getHint(board) {
    const { grid, solution, locked } = board;
    let best = null;
    let bestCount = Infinity;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (locked[r][c] || grid[r][c] !== 0) continue;
        const cands = _candidates(grid, r, c);
        if (cands.length < bestCount) {
          bestCount = cands.length;
          best = { r, c, cands };
        }
      }
    }

    if (!best) return null;

    const { r, c } = best;
    const value = solution[r][c];
    const rowUsed = [..._usedInRow(grid, r)].sort((a,b)=>a-b);
    const colUsed = [..._usedInCol(grid, c)].sort((a,b)=>a-b);
    const boxUsed = [..._usedInBox(grid, r, c)].sort((a,b)=>a-b);

    return { row: r, col: c, value, rowUsed, colUsed, boxUsed };
  }

  return { getHint };
})();
