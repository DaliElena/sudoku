const SudokuGenerator = (() => {

  function rnd(n) { return Math.floor(Math.random() * n); }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = rnd(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Базовая корректная сетка через циклические сдвиги (статья habr.com/ru/articles/192102/)
  function makeBase() {
    const grid = [];
    for (let r = 0; r < 9; r++) {
      const row = [];
      const band = Math.floor(r / 3);
      const pos  = r % 3;
      const start = (band + pos * 3) % 9; // смещение строки
      for (let c = 0; c < 9; c++) {
        row.push((start + c) % 9 + 1);
      }
      grid.push(row);
    }
    return grid;
  }

  // Пять инвариантных преобразований, сохраняющих корректность сетки
  function shuffleGrid(grid) {
    // Транспонирование
    if (rnd(2)) {
      const t = Array.from({length:9}, (_,r) => Array.from({length:9}, (_,c) => grid[c][r]));
      grid = t;
    }

    // Перестановка строк внутри каждого горизонтального района
    for (let band = 0; band < 3; band++) {
      const order = shuffle([0, 1, 2]);
      const rows  = order.map(i => grid[band * 3 + i].slice());
      for (let i = 0; i < 3; i++) grid[band * 3 + i] = rows[i];
    }

    // Перестановка столбцов внутри каждого вертикального района
    for (let band = 0; band < 3; band++) {
      const order = shuffle([0, 1, 2]);
      for (let r = 0; r < 9; r++) {
        const cols = order.map(i => grid[r][band * 3 + i]);
        for (let i = 0; i < 3; i++) grid[r][band * 3 + i] = cols[i];
      }
    }

    // Перестановка горизонтальных районов
    const hBands = shuffle([0, 1, 2]);
    const byRow = hBands.flatMap(b => [grid[b*3], grid[b*3+1], grid[b*3+2]]);
    for (let r = 0; r < 9; r++) grid[r] = byRow[r];

    // Перестановка вертикальных районов
    const vBands = shuffle([0, 1, 2]);
    for (let r = 0; r < 9; r++) {
      const row = grid[r];
      grid[r] = vBands.flatMap(b => [row[b*3], row[b*3+1], row[b*3+2]]);
    }

    // Замена цифр (1-9 → произвольная перестановка)
    const map = shuffle([1,2,3,4,5,6,7,8,9]);
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        grid[r][c] = map[grid[r][c] - 1];

    return grid;
  }

  function generateSolution() {
    return shuffleGrid(makeBase());
  }

  // ─── Проверка уникальности ────────────────────────────────────────────────

  function isValid(grid, row, col, val) {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === val) return false;
      if (grid[i][col] === val) return false;
    }
    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++)
      for (let c = bc; c < bc + 3; c++)
        if (grid[r][c] === val) return false;
    return true;
  }

  // Подсчёт решений с ранним выходом при count >= limit
  function countSolutions(grid, limit = 2) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== 0) continue;
        let count = 0;
        for (let num = 1; num <= 9; num++) {
          if (!isValid(grid, row, col, num)) continue;
          grid[row][col] = num;
          count += countSolutions(grid, limit - count);
          grid[row][col] = 0;
          if (count >= limit) return count;
        }
        return count;
      }
    }
    return 1;
  }

  // ─── Создание головоломки с гарантированно единственным решением ──────────

  const CLUES = { easy: 36, medium: 28, hard: 22 };

  function createPuzzle(solution, difficulty = 'medium') {
    const puzzle = solution.map(row => [...row]);
    const clues   = CLUES[difficulty] ?? CLUES.medium;
    const cells   = shuffle(Array.from({length:81}, (_, i) => [Math.floor(i/9), i%9]));
    let removed   = 0;
    const target  = 81 - clues;

    for (const [r, c] of cells) {
      if (removed >= target) break;
      const backup = puzzle[r][c];
      puzzle[r][c] = 0;
      // Восстанавливаем ячейку, если без неё возникает более одного решения
      if (countSolutions(puzzle) !== 1) {
        puzzle[r][c] = backup;
      } else {
        removed++;
      }
    }
    return puzzle;
  }

  return { generateSolution, createPuzzle, isValid };
})();
