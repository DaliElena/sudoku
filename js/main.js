document.addEventListener('DOMContentLoaded', () => {
  const board    = new Board();
  const renderer = new Renderer(document.getElementById('board'));
  const history  = new History();

  let timerSeconds = 0;
  let timerInterval = null;

  function startTimer() {
    clearInterval(timerInterval);
    timerSeconds = 0;
    renderer.updateTimer(0);
    timerInterval = setInterval(() => {
      timerSeconds++;
      renderer.updateTimer(timerSeconds);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function startGame(difficulty) {
    board.newGame(difficulty);
    history.clear();
    renderer.init();
    renderer.render(board);
    renderer.updateMistakes(board.mistakes, board.maxMistakes);
    renderer.updateNumpad(board);
    renderer.updatePencilBtn(false);
    renderer.hideModal();
    if (input) input.pencilMode = false;
    startTimer();
  }

  const input = new InputHandler(
    board, renderer, history,
    () => { stopTimer(); renderer.showVictory(timerSeconds); },
    () => { stopTimer(); renderer.showGameOver(); }
  );

  // Кнопки сложности
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('difficulty-btn--active'));
      btn.classList.add('difficulty-btn--active');
      startGame(btn.dataset.difficulty);
    });
  });

  // Кнопка новой игры
  document.getElementById('btn-new').addEventListener('click', () => {
    const active = document.querySelector('.difficulty-btn--active');
    startGame(active?.dataset.difficulty ?? 'easy');
  });

  // Кнопка новой игры в модалке (добавляется динамически)
  document.addEventListener('click', e => {
    if (e.target.id === 'modal-new-btn') {
      const active = document.querySelector('.difficulty-btn--active');
      startGame(active?.dataset.difficulty ?? 'easy');
    }
  });

  startGame('easy');
});
