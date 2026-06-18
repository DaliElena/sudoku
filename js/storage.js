const Storage = (() => {
  const KEY = 'sudoku_save';

  function saveGame(board, seconds) {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        grid:       board.grid,
        notes:      board.notes,
        puzzle:     board.puzzle,
        solution:   board.solution,
        locked:     board.locked,
        mistakes:   board.mistakes,
        difficulty: board.difficulty,
        seconds,
      }));
    } catch (_) {}
  }

  function loadGame() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  function clearSave() {
    localStorage.removeItem(KEY);
  }

  return { saveGame, loadGame, clearSave };
})();
