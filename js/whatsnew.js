const WhatsNew = (() => {
  const CURRENT_VERSION = '1.1.4';
  const STORAGE_KEY = 'sudoku-seen-version';

  const NOTES = {
    ru: [
      'Подсказка с объяснением: кнопка 💡 теперь показывает, почему цифра подходит',
      'Гарантия уникального решения при генерации новой головоломки',
    ],
    en: [
      'Hint with explanation: the 💡 button now shows why a digit fits',
      'Unique solution guaranteed when generating a new puzzle',
    ],
  };

  function _hasSeenCurrent() {
    return localStorage.getItem(STORAGE_KEY) === CURRENT_VERSION;
  }

  function _markSeen() {
    localStorage.setItem(STORAGE_KEY, CURRENT_VERSION);
  }

  function _buildToast() {
    const lang = I18n.currentLang();
    const notes = NOTES[lang] || NOTES.ru;
    const isRu = lang === 'ru';

    const toast = document.createElement('div');
    toast.className = 'whatsnew-toast';
    toast.innerHTML = `
      <div class="whatsnew-toast__header">
        <span class="whatsnew-toast__title">${isRu ? 'Что нового' : "What's new"} · ${CURRENT_VERSION}</span>
        <button class="whatsnew-toast__close" aria-label="${isRu ? 'Закрыть' : 'Close'}">✕</button>
      </div>
      <ul class="whatsnew-toast__list">
        ${notes.map(n => `<li>${n}</li>`).join('')}
      </ul>
    `;

    toast.querySelector('.whatsnew-toast__close').addEventListener('click', () => {
      _dismiss(toast);
    });

    return toast;
  }

  function _dismiss(toast) {
    toast.classList.add('whatsnew-toast--out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
    _markSeen();
  }

  function check() {
    if (_hasSeenCurrent()) return;

    const toast = _buildToast();
    document.body.appendChild(toast);

    // Auto-dismiss after 12 s
    setTimeout(() => {
      if (toast.isConnected) _dismiss(toast);
    }, 12000);
  }

  return { check };
})();
