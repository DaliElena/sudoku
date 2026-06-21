const SudokuGenerator = (() => {

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function isValid(grid, row, col, val) {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === val) return false;
      if (grid[i][col] === val) return false;
    }
    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++) {
      for (let c = bc; c < bc + 3; c++) {
        if (grid[r][c] === val) return false;
      }
    }
    return true;
  }

  function solve(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== 0) continue;
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (!isValid(grid, row, col, num)) continue;
          grid[row][col] = num;
          if (solve(grid)) return true;
          grid[row][col] = 0;
        }
        return false;
      }
    }
    return true;
  }

  function generateSolution() {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    solve(grid);
    return grid;
  }

  const CLUES = { easy: 36, medium: 28, hard: 22 };

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

  function createPuzzle(solution, difficulty = 'medium') {
    const puzzle = solution.map(row => [...row]);
    const clues = CLUES[difficulty] ?? CLUES.medium;
    const cells = shuffle(
      Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9])
    );
    let removed = 0;
    const target = 81 - clues;
    for (const [r, c] of cells) {
      if (removed >= target) break;
      const backup = puzzle[r][c];
      puzzle[r][c] = 0;
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
