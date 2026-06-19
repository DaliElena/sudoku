class Board {
  constructor() {
    this.solution = [];
    this.puzzle   = [];
    this.grid     = [];
    this.notes    = [];
    this.locked   = [];
    this.selected = null;
    this.difficulty = 'easy';
    this.mistakes = 0;
    this.maxMistakes = 3;
  }

  newGame(difficulty = 'easy') {
    const maxByDifficulty = { easy: 10, medium: 5, hard: 3 };
    this.difficulty   = difficulty;
    this.mistakes     = 0;
    this.maxMistakes  = maxByDifficulty[difficulty] ?? 3;
    this.selected   = null;
    this.solution   = SudokuGenerator.generateSolution();
    this.puzzle     = SudokuGenerator.createPuzzle(this.solution, difficulty);
    this.grid       = this.puzzle.map(row => [...row]);
    this.locked     = this.puzzle.map(row => row.map(v => v !== 0));
    this.notes      = Array.from({length: 9}, () =>
                        Array.from({length: 9}, () => Array(10).fill(false)));
  }

  isLocked(row, col) {
    return this.locked[row]?.[col] ?? false;
  }

  setValue(row, col, value) {
    if (this.isLocked(row, col)) return false;
    this.grid[row][col] = value;
    // Очищаем заметки в этой ячейке при вводе значения
    if (value !== 0) {
      this.notes[row][col] = Array(10).fill(false);
    }
    return true;
  }

  clearValue(row, col) {
    return this.setValue(row, col, 0);
  }

  toggleNote(row, col, num) {
    if (this.isLocked(row, col)) return;
    if (this.grid[row][col] !== 0) return;
    this.notes[row][col][num] = !this.notes[row][col][num];
  }

  setSelected(row, col) {
    this.selected = (row === null) ? null : { row, col };
  }

  isSolved() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.grid[r][c] !== this.solution[r][c]) return false;
      }
    }
    return true;
  }

  isGameOver() {
    return this.mistakes >= this.maxMistakes;
  }

  getSnapshot() {
    return {
      grid:  this.grid.map(row => [...row]),
      notes: this.notes.map(row => row.map(cell => [...cell])),
      mistakes: this.mistakes,
    };
  }

  restoreSnapshot(snapshot) {
    this.grid     = snapshot.grid.map(row => [...row]);
    this.notes    = snapshot.notes.map(row => row.map(cell => [...cell]));
    this.mistakes = snapshot.mistakes;
  }
}
