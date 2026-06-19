document.addEventListener('DOMContentLoaded', () => {
  Settings.loadTheme();
  const board    = new Board();
  const renderer = new Renderer(document.getElementById('board'));
  const history  = new History();
  const timer    = new Timer();

  timer.onTick(s => {
    renderer.updateTimer(s);
    Storage.saveGame(board, s);
  });

  function startGame(difficulty, saved) {
    timer.reset();
    history.clear();
    renderer.hideModal();

    if (saved) {
      board.difficulty  = saved.difficulty;
      board.mistakes    = saved.mistakes;
      const maxByDiff   = { easy: 10, medium: 5, hard: 3 };
      board.maxMistakes = maxByDiff[saved.difficulty] ?? 3;
      board.puzzle     = saved.puzzle;
      board.solution   = saved.solution;
      board.locked     = saved.locked;
      board.grid       = saved.grid;
      board.notes      = saved.notes;
      board.selected   = null;
      timer.seconds    = saved.seconds;
      renderer.updateTimer(saved.seconds);
    } else {
      board.newGame(difficulty);
      Storage.clearSave();
    }

    if (input) input.pencilMode = false;

    renderer.init();
    renderer.render(board);
    renderer.renderNotes(board);
    renderer.updateMistakes(board.mistakes, board.maxMistakes);
    renderer.updateNumpad(board);
    renderer.updatePencilBtn(false);

    timer.start();
  }

  function onSolved() {
    timer.pause();
    Storage.clearSave();
    renderer.showVictory(timer.seconds);
  }

  function onGameOver() {
    timer.pause();
    Storage.clearSave();
    renderer.showGameOver();
  }

  // InputHandler регистрирует saveGame после каждого хода
  const input = new InputHandler(board, renderer, history, onSolved, onGameOver, () => {
    Storage.saveGame(board, timer.seconds);
  });

  function isGameInProgress() {
    return board.grid && board.grid.some((row, r) =>
      row.some((val, c) => val !== 0 && !board.locked[r][c])
    );
  }

  function requestNewGame(difficulty) {
    const go = () => startGame(difficulty);
    if (isGameInProgress()) {
      renderer.showConfirm(go);
    } else {
      go();
    }
  }

  // Кнопки сложности
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newDifficulty = btn.dataset.difficulty;
      const activeDifficulty = document.querySelector('.difficulty-btn--active')?.dataset.difficulty;
      const switchDifficulty = () => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('difficulty-btn--active'));
        btn.classList.add('difficulty-btn--active');
        startGame(newDifficulty);
      };
      if (isGameInProgress()) {
        renderer.showConfirm(switchDifficulty);
      } else {
        switchDifficulty();
      }
    });
  });

  // Кнопка настроек
  document.getElementById('btn-settings').addEventListener('click', () => Settings.showPanel());

  // Кнопка новой игры
  document.getElementById('btn-new').addEventListener('click', () => {
    const active = document.querySelector('.difficulty-btn--active');
    requestNewGame(active?.dataset.difficulty ?? 'easy');
  });

  // Кнопка в модалке
  document.addEventListener('click', e => {
    if (e.target.id === 'modal-new-btn') {
      const active = document.querySelector('.difficulty-btn--active');
      startGame(active?.dataset.difficulty ?? 'easy');
    }
  });

  // Старт: восстановить сохранение или новая игра
  const saved = Storage.loadGame();
  if (saved) {
    const diffBtn = document.querySelector(`.difficulty-btn[data-difficulty="${saved.difficulty}"]`);
    if (diffBtn) {
      document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('difficulty-btn--active'));
      diffBtn.classList.add('difficulty-btn--active');
    }
    startGame(null, saved);
  } else {
    startGame('easy');
  }
});
