const Settings = (() => {
  const THEMES = [
    { id: 'midnight', name: 'Полночь', colors: ['#1a1a2e', '#e94560', '#5b9cf6'] },
    { id: 'twilight', name: 'Сумерки', colors: ['#13111a', '#c084fc', '#38bdf8'] },
    { id: 'classic',  name: 'Классика', colors: ['#000000', '#ffffff', '#4d9de0'] },
    { id: 'paper',    name: 'Бумага',   colors: ['#f2ede4', '#2563eb', '#1c1917'] },
  ];

  const FONT_SIZES = [
    { id: 'small',  name: 'Маленький', cell: 'clamp(12px, 3.2vw, 20px)', note: 'clamp(5px, 1.4vw, 9px)'  },
    { id: 'medium', name: 'Средний',   cell: 'clamp(16px, 4.5vw, 28px)', note: 'clamp(7px, 1.8vw, 11px)' },
    { id: 'large',  name: 'Большой',   cell: 'clamp(20px, 5.8vw, 36px)', note: 'clamp(8px, 2.2vw, 13px)' },
  ];

  function applyTheme(id) {
    document.documentElement.dataset.theme = id;
    localStorage.setItem('sudoku-theme', id);
    _updateActiveTheme(id);
  }

  function loadTheme() {
    const saved = localStorage.getItem('sudoku-theme');
    const valid = THEMES.some(t => t.id === saved);
    applyTheme(valid ? saved : 'paper');
  }

  function applyFontSize(id) {
    const size = FONT_SIZES.find(s => s.id === id) || FONT_SIZES[1];
    document.documentElement.style.setProperty('--font-size-cell', size.cell);
    document.documentElement.style.setProperty('--font-size-note', size.note);
    localStorage.setItem('sudoku-font-size', id);
    _updateActiveFontSize(id);
  }

  function loadFontSize() {
    const saved = localStorage.getItem('sudoku-font-size');
    const valid = FONT_SIZES.some(s => s.id === saved);
    applyFontSize(valid ? saved : 'medium');
  }

  function _updateActiveTheme(activeId) {
    document.querySelectorAll('.theme-card').forEach(card => {
      card.classList.toggle('theme-card--active', card.dataset.themeId === activeId);
    });
  }

  function _updateActiveFontSize(activeId) {
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.classList.toggle('size-btn--active', btn.dataset.sizeId === activeId);
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
    _updateActiveFontSize(localStorage.getItem('sudoku-font-size') || 'medium');
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

      <p class="settings-panel__label" style="margin-top: var(--gap-md);">Размер цифр</p>
      <div class="size-grid">
        ${FONT_SIZES.map(s => `
          <button class="size-btn" data-size-id="${s.id}" aria-label="Размер ${s.name}">
            <span class="size-btn__preview" style="font-size: ${s.id === 'small' ? '14px' : s.id === 'medium' ? '18px' : '24px'}">5</span>
            <span class="size-btn__label">${s.name}</span>
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
      if (card) { applyTheme(card.dataset.themeId); return; }
      const sizeBtn = e.target.closest('.size-btn');
      if (sizeBtn) applyFontSize(sizeBtn.dataset.sizeId);
    });

    return overlay;
  }

  return { loadTheme, loadFontSize, showPanel, hidePanel };
})();
