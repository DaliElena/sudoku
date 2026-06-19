const Settings = (() => {
  const THEMES = [
    {
      id: 'midnight',
      name: 'Полночь',
      colors: ['#1a1a2e', '#e94560', '#5b9cf6'],
    },
    {
      id: 'twilight',
      name: 'Сумерки',
      colors: ['#13111a', '#c084fc', '#38bdf8'],
    },
    {
      id: 'classic',
      name: 'Классика',
      colors: ['#000000', '#ffffff', '#4d9de0'],
    },
    {
      id: 'paper',
      name: 'Бумага',
      colors: ['#f2ede4', '#2563eb', '#1c1917'],
    },
  ];

  function applyTheme(id) {
    document.documentElement.dataset.theme = id;
    localStorage.setItem('sudoku-theme', id);
    _updateActiveTheme(id);
  }

  function loadTheme() {
    const saved = localStorage.getItem('sudoku-theme');
    const valid = THEMES.some(t => t.id === saved);
    applyTheme(valid ? saved : 'midnight');
  }

  function _updateActiveTheme(activeId) {
    document.querySelectorAll('.theme-card').forEach(card => {
      card.classList.toggle('theme-card--active', card.dataset.themeId === activeId);
    });
  }

  function showPanel() {
    let overlay = document.getElementById('settings-overlay');
    if (!overlay) {
      overlay = _createPanel();
      document.body.appendChild(overlay);
    }
    overlay.classList.remove('hidden');
    _updateActiveTheme(document.documentElement.dataset.theme || 'midnight');
  }

  function hidePanel() {
    const overlay = document.getElementById('settings-overlay');
    if (overlay) overlay.classList.add('hidden');
  }

  function _createPanel() {
    const overlay = document.createElement('div');
    overlay.id = 'settings-overlay';
    overlay.className = 'settings-overlay hidden';

    const panel = document.createElement('div');
    panel.className = 'settings-panel';

    panel.innerHTML = `
      <div class="settings-panel__header">
        <span class="settings-panel__title">Настройки</span>
        <button class="settings-panel__close" id="settings-close" aria-label="Закрыть">✕</button>
      </div>
      <p class="settings-panel__label">Тема оформления</p>
      <div class="theme-grid">
        ${THEMES.map(t => `
          <button class="theme-card" data-theme-id="${t.id}" aria-label="Тема ${t.name}">
            <div class="theme-card__preview">
              ${t.colors.map(c => `<span class="theme-card__swatch" style="background:${c}"></span>`).join('')}
            </div>
            <span class="theme-card__name">${t.name}</span>
          </button>
        `).join('')}
      </div>
    `;

    overlay.appendChild(panel);

    overlay.addEventListener('click', e => {
      if (e.target === overlay) hidePanel();
    });
    panel.addEventListener('click', e => {
      const close = e.target.closest('#settings-close');
      if (close) { hidePanel(); return; }
      const card = e.target.closest('.theme-card');
      if (card) applyTheme(card.dataset.themeId);
    });

    return overlay;
  }

  return { loadTheme, showPanel, hidePanel };
})();
