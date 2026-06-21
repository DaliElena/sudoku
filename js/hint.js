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

  // Ищет naked single: клетка, в которую по строке+столбцу+блоку подходит ровно одна цифра.
  function _findNakedSingle(grid, locked) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (locked[r][c] || grid[r][c] !== 0) continue;
        const cands = _candidates(grid, r, c);
        if (cands.length === 1) {
          return { r, c, value: cands[0], type: 'naked' };
        }
      }
    }
    return null;
  }

  // Ищет hidden single: цифра, которая в данной строке/столбце/блоке
  // может встать только в одну клетку.
  function _findHiddenSingle(grid, locked) {
    // Проверяем все строки, столбцы и блоки для каждой цифры 1-9
    for (let digit = 1; digit <= 9; digit++) {

      // По строкам
      for (let r = 0; r < 9; r++) {
        const cells = [];
        for (let c = 0; c < 9; c++) {
          if (!locked[r][c] && grid[r][c] === 0 && _candidates(grid, r, c).includes(digit)) {
            cells.push(c);
          }
        }
        if (cells.length === 1) {
          return { r, c: cells[0], value: digit, type: 'hidden', group: 'row', groupIdx: r };
        }
      }

      // По столбцам
      for (let c = 0; c < 9; c++) {
        const cells = [];
        for (let r = 0; r < 9; r++) {
          if (!locked[r][c] && grid[r][c] === 0 && _candidates(grid, r, c).includes(digit)) {
            cells.push(r);
          }
        }
        if (cells.length === 1) {
          return { r: cells[0], c, value: digit, type: 'hidden', group: 'col', groupIdx: c };
        }
      }

      // По блокам 3×3
      for (let br = 0; br < 3; br++) {
        for (let bc = 0; bc < 3; bc++) {
          const cells = [];
          for (let dr = 0; dr < 3; dr++) {
            for (let dc = 0; dc < 3; dc++) {
              const r = br * 3 + dr, c = bc * 3 + dc;
              if (!locked[r][c] && grid[r][c] === 0 && _candidates(grid, r, c).includes(digit)) {
                cells.push([r, c]);
              }
            }
          }
          if (cells.length === 1) {
            return { r: cells[0][0], c: cells[0][1], value: digit, type: 'hidden', group: 'box', groupIdx: br * 3 + bc };
          }
        }
      }
    }
    return null;
  }

  function getHint(board) {
    const { grid, locked } = board;

    const naked = _findNakedSingle(grid, locked);
    if (naked) {
      const { r, c, value } = naked;
      const rowUsed = [..._usedInRow(grid, r)].sort((a, b) => a - b);
      const colUsed = [..._usedInCol(grid, c)].sort((a, b) => a - b);
      const boxUsed = [..._usedInBox(grid, r, c)].sort((a, b) => a - b);
      // Deduplicated union of all blocked digits (excluding the answer itself)
      const blocked = [...new Set([...rowUsed, ...colUsed, ...boxUsed])]
        .filter(n => n !== value)
        .sort((a, b) => a - b);
      return { row: r, col: c, value, type: 'naked', rowUsed, colUsed, boxUsed, blocked };
    }

    const hidden = _findHiddenSingle(grid, locked);
    if (hidden) {
      const { r, c, value, group } = hidden;
      return { row: r, col: c, value, type: 'hidden', group };
    }

    return null;
  }

  return { getHint };
})();
