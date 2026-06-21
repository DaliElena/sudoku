class Renderer {
  constructor(boardEl) {
    this.boardEl = boardEl;
    this.cells = [];
  }

  init() {
    this.boardEl.innerHTML = '';
    this.cells = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-row', r);
        cell.setAttribute('data-col', c);
        cell.setAttribute('role', 'gridcell');
        this.boardEl.appendChild(cell);
        this.cells.push(cell);
      }
    }
  }

  _cell(r, c) {
    return this.cells[r * 9 + c];
  }

  render(board) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const el = this._cell(r, c);
        const val = board.grid[r][c];
        const locked = board.isLocked(r, c);

        el.className = 'cell';
        if (locked) {
          el.classList.add('cell--locked');
        } else if (val) {
          const wrong = val !== board.solution[r][c];
          el.classList.add(wrong ? 'cell--wrong' : 'cell--filled');
        }

        el.textContent = val !== 0 ? val : '';
      }
    }
  }

  highlightSelected(board) {
    const sel = board.selected;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const el = this._cell(r, c);
        el.classList.remove('cell--selected', 'cell--highlight', 'cell--same-value');
        if (!sel) continue;

        if (r === sel.row && c === sel.col) {
          el.classList.add('cell--selected');
        } else if (
          r === sel.row || c === sel.col ||
          (Math.floor(r / 3) === Math.floor(sel.row / 3) &&
           Math.floor(c / 3) === Math.floor(sel.col / 3))
        ) {
          el.classList.add('cell--highlight');
        }

        const selVal = board.grid[sel.row][sel.col];
        if (selVal !== 0 && board.grid[r][c] === selVal && !(r === sel.row && c === sel.col)) {
          el.classList.add('cell--same-value');
        }
      }
    }
  }

  showConflicts(conflicts) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        this._cell(r, c).classList.remove('cell--conflict');
      }
    }
    for (const {row, col} of conflicts) {
      this._cell(row, col).classList.add('cell--conflict');
    }
  }

  updateTimer(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${m}:${s}`;
  }

  updateMistakes(count, max) {
    if (!Settings.isMistakesEnabled()) return;
    document.getElementById('mistakes').textContent = `${count} / ${max}`;
  }

  renderNotes(board) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board.grid[r][c] !== 0 || board.isLocked(r, c)) continue;
        const el = this._cell(r, c);
        const hasNotes = board.notes[r][c].some(Boolean);
        el.classList.toggle('cell--has-notes', hasNotes);
        if (!hasNotes) { el.textContent = ''; continue; }

        const grid = document.createElement('div');
        grid.className = 'cell__notes';
        for (let n = 1; n <= 9; n++) {
          const span = document.createElement('span');
          span.className = 'cell__note' + (board.notes[r][c][n] ? ' cell__note--active' : '');
          span.textContent = board.notes[r][c][n] ? n : '';
          grid.appendChild(span);
        }
        el.textContent = '';
        el.appendChild(grid);
      }
    }
  }

  updateNumpad(board) {
    const selVal = board.selected ? board.grid[board.selected.row][board.selected.col] : 0;
    document.querySelectorAll('.numpad-btn').forEach(btn => {
      const v = Number(btn.dataset.value);
      btn.classList.toggle('numpad-btn--active', v === selVal && selVal !== 0);
    });
  }

  updatePencilBtn(pencilMode) {
    const btn = document.getElementById('btn-pencil');
    btn.setAttribute('aria-pressed', String(pencilMode));
  }

  showVictory(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    this._showModal(I18n.t('victory'), `${I18n.t('victoryTime')}: ${m}:${s}`);
  }

  showGameOver() {
    this._showModal(I18n.t('gameOver'), I18n.t('gameOverSub'));
  }

  _showModal(title, subtitle) {
    let overlay = document.getElementById('modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'modal-overlay';
      overlay.className = 'modal-overlay';
      overlay.innerHTML = `
        <div class="modal">
          <div class="modal__title"></div>
          <div class="modal__subtitle"></div>
          <button class="modal__btn" id="modal-new-btn"></button>
        </div>`;
      document.body.appendChild(overlay);
    }
    overlay.querySelector('.modal__title').textContent = title;
    overlay.querySelector('.modal__subtitle').textContent = subtitle;
    overlay.querySelector('#modal-new-btn').textContent = I18n.t('modalNewGame');
    overlay.classList.remove('hidden');
  }

  hideModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.add('hidden');
  }

  showConfirm(onConfirm) {
    let overlay = document.getElementById('confirm-overlay');
    if (overlay) overlay.remove();
    overlay = document.createElement('div');
    overlay.id = 'confirm-overlay';
    overlay.className = 'modal-overlay hidden';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal__title">${I18n.t('confirmTitle')}</div>
        <div class="modal__subtitle">${I18n.t('confirmSub')}</div>
        <div class="confirm__actions">
          <button class="modal__btn modal__btn--secondary" id="confirm-cancel-btn">${I18n.t('confirmCancel')}</button>
          <button class="modal__btn" id="confirm-ok-btn">${I18n.t('confirmOk')}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.classList.remove('hidden');

    const ok = overlay.querySelector('#confirm-ok-btn');
    const cancel = overlay.querySelector('#confirm-cancel-btn');

    const cleanup = () => {
      overlay.classList.add('hidden');
      ok.removeEventListener('click', handleOk);
      cancel.removeEventListener('click', handleCancel);
      overlay.removeEventListener('click', handleBackdrop);
    };
    const handleOk = () => { cleanup(); onConfirm(); };
    const handleCancel = () => cleanup();
    const handleBackdrop = (e) => { if (e.target === overlay) cleanup(); };

    ok.addEventListener('click', handleOk);
    cancel.addEventListener('click', handleCancel);
    overlay.addEventListener('click', handleBackdrop);
  }

  showHint(hint, onClose) {
    // Подсветить клетку
    this._cell(hint.row, hint.col).classList.add('cell--hint');

    // Создать/обновить панель
    let panel = document.getElementById('hint-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'hint-panel';
      panel.className = 'hint-panel';
      document.body.appendChild(panel);
    }

    const tags = (nums, label) =>
      nums.length ? `<span class="hint-panel__tag">${label}: ${nums.join(', ')}</span>` : '';

    panel.innerHTML = `
      <div class="hint-panel__header">
        <span class="hint-panel__icon">💡</span>
        <span class="hint-panel__title">${I18n.t('hint')}</span>
      </div>
      <div class="hint-panel__body">
        <div class="hint-panel__answer">${I18n.t('hintExplain')} <strong>${hint.value}</strong></div>
        <div class="hint-panel__reason">
          ${tags(hint.rowUsed, I18n.t('hintRow'))}
          ${tags(hint.colUsed, I18n.t('hintCol'))}
          ${tags(hint.boxUsed, I18n.t('hintBox'))}
        </div>
      </div>
      <button class="hint-panel__close" id="hint-close-btn">${I18n.t('hintClose')}</button>`;

    // Показать панель
    requestAnimationFrame(() => panel.classList.add('hint-panel--visible'));

    const close = () => {
      panel.classList.remove('hint-panel--visible');
      this._cell(hint.row, hint.col).classList.remove('cell--hint');
      panel.querySelector('#hint-close-btn')?.removeEventListener('click', close);
      this._activeHintClose = null;
      if (onClose) onClose();
    };

    panel.querySelector('#hint-close-btn').addEventListener('click', close);
    this._activeHintClose = close;
    this._hintRow = hint.row;
    this._hintCol = hint.col;
  }

  hideHint() {
    if (this._activeHintClose) {
      this._activeHintClose();
    } else {
      // Fallback: just hide visually if close callback is already gone
      const panel = document.getElementById('hint-panel');
      if (panel) panel.classList.remove('hint-panel--visible');
      if (this._hintRow != null) {
        this._cell(this._hintRow, this._hintCol)?.classList.remove('cell--hint');
        this._hintRow = null; this._hintCol = null;
      }
    }
  }

  showMistakesExceeded(onNewGame, onDisable) {
    let overlay = document.getElementById('mistakes-exceeded-overlay');
    if (overlay) overlay.remove();
    overlay = document.createElement('div');
    overlay.id = 'mistakes-exceeded-overlay';
    overlay.className = 'modal-overlay hidden';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal__title">${I18n.t('mistakesExceededTitle')}</div>
        <div class="modal__subtitle">${I18n.t('mistakesExceededSub')}</div>
        <div class="confirm__actions">
          <button class="modal__btn modal__btn--secondary" id="me-disable-btn">${I18n.t('mistakesDisable')}</button>
          <button class="modal__btn" id="me-new-btn">${I18n.t('modalNewGame')}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.classList.remove('hidden');

    const newBtn  = overlay.querySelector('#me-new-btn');
    const disBtn  = overlay.querySelector('#me-disable-btn');

    const cleanup = () => {
      overlay.classList.add('hidden');
      newBtn.removeEventListener('click', handleNew);
      disBtn.removeEventListener('click', handleDisable);
    };
    const handleNew     = () => { cleanup(); onNewGame(); };
    const handleDisable = () => { cleanup(); onDisable(); };

    newBtn.addEventListener('click', handleNew);
    disBtn.addEventListener('click', handleDisable);
  }
}
