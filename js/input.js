class InputHandler {
  constructor(board, renderer, history, onSolved, onGameOver, onAfterChange) {
    this.board         = board;
    this.renderer      = renderer;
    this.history       = history;
    this.onSolved      = onSolved;
    this.onGameOver    = onGameOver;
    this.onAfterChange = onAfterChange;
    this.pencilMode = false;

    this._bindBoard();
    this._bindNumpad();
    this._bindKeyboard();
    this._bindControls();
  }

  _bindBoard() {
    this.renderer.boardEl.addEventListener('click', e => {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      const r = Number(cell.dataset.row);
      const c = Number(cell.dataset.col);
      this.board.setSelected(r, c);
      this.renderer.highlightSelected(this.board);
      this.renderer.updateNumpad(this.board);
    });
  }

  _bindNumpad() {
    document.querySelectorAll('.numpad-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._input(Number(btn.dataset.value));
      });
    });
  }

  _bindKeyboard() {
    document.addEventListener('keydown', e => {
      if (!this.board.selected) return;

      if (e.key >= '1' && e.key <= '9') {
        this._input(Number(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        this._erase();
      } else {
        const moves = { ArrowUp:[-1,0], ArrowDown:[1,0], ArrowLeft:[0,-1], ArrowRight:[0,1] };
        if (moves[e.key]) {
          e.preventDefault();
          const {row, col} = this.board.selected;
          const [dr, dc] = moves[e.key];
          const nr = Math.max(0, Math.min(8, row + dr));
          const nc = Math.max(0, Math.min(8, col + dc));
          this.board.setSelected(nr, nc);
          this.renderer.highlightSelected(this.board);
          this.renderer.updateNumpad(this.board);
        }
      }
    });
  }

  _bindControls() {
    document.getElementById('btn-erase').addEventListener('click', () => this._erase());
    document.getElementById('btn-pencil').addEventListener('click', () => {
      this.pencilMode = !this.pencilMode;
      this.renderer.updatePencilBtn(this.pencilMode);
    });
  }

  _input(num) {
    this.renderer.hideHint();
    const sel = this.board.selected;
    if (!sel) return;
    if (this.board.isLocked(sel.row, sel.col)) return;
    if (this.board.isGameOver()) return;

    this.history.push(this.board.getSnapshot());

    if (this.pencilMode) {
      this.board.toggleNote(sel.row, sel.col, num);
      this._afterChange(false);
    } else {
      const correct = this.board.solution[sel.row][sel.col] === num;
      if (!correct) this.board.mistakes++;
      this.board.setValue(sel.row, sel.col, num);
      this._afterChange(true);
    }
  }

  _erase() {
    const sel = this.board.selected;
    if (!sel || this.board.isLocked(sel.row, sel.col)) return;
    this.board.clearValue(sel.row, sel.col);
    this._afterChange(true);
  }

  _afterChange(checkWin) {
    const board = this.board;
    const renderer = this.renderer;

    renderer.render(board);
    renderer.renderNotes(board);
    renderer.highlightSelected(board);
    renderer.updateNumpad(board);
    renderer.updateMistakes(board.mistakes, board.maxMistakes);

    this.onAfterChange?.();

    if (!checkWin) return;

    if (board.isGameOver()) {
      this.onGameOver?.();
    } else if (Validator.isSolved(board.grid, board.solution)) {
      this.onSolved?.();
    }
  }
}
