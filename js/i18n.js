const I18n = (() => {
  const LANGS = ['ru', 'en'];

  const TRANSLATIONS = {
    ru: {
      title: 'Судоку',
      mistakes: 'Ошибки',
      time: 'Время',
      erase: 'Стереть',
      notes: 'Заметки',
      newGame: 'Новая',
      settings: 'Настройки',
      diffEasy: 'Лёгкий',
      diffMedium: 'Средний',
      diffHard: 'Сложный',
      boardLabel: 'Игровое поле судоку',
      numpadLabel: 'Цифровая панель',

      settingsTitle: 'Настройки',
      settingsClose: 'Закрыть',
      settingsThemeLabel: 'Тема оформления',
      settingsFontLabel: 'Размер цифр',
      settingsMistakesLabel: 'Счётчик ошибок',
      settingsLangLabel: 'Язык',

      themeNameMidnight: 'Полночь',
      themeNameTwilight: 'Сумерки',
      themeNameClassic: 'Классика',
      themeNamePaper: 'Бумага',

      fontNameSmall: 'Маленький',
      fontNameMedium: 'Средний',
      fontNameLarge: 'Большой',

      victory: 'Победа! 🎉',
      victoryTime: 'Время',
      gameOver: 'Игра окончена',
      gameOverSub: 'Слишком много ошибок',
      modalNewGame: 'Новая игра',

      confirmTitle: 'Новая игра?',
      confirmSub: 'Текущий прогресс будет потерян',
      confirmCancel: 'Отмена',
      confirmOk: 'Начать',

      mistakesExceededTitle: 'Лимит ошибок превышен',
      mistakesExceededSub: 'Количество ошибок для данного уровня превышено',
      mistakesDisable: 'Отключить счётчик',
    },
    en: {
      title: 'Sudoku',
      mistakes: 'Mistakes',
      time: 'Time',
      erase: 'Erase',
      notes: 'Notes',
      newGame: 'New',
      settings: 'Settings',
      diffEasy: 'Easy',
      diffMedium: 'Medium',
      diffHard: 'Hard',
      boardLabel: 'Sudoku game board',
      numpadLabel: 'Number pad',

      settingsTitle: 'Settings',
      settingsClose: 'Close',
      settingsThemeLabel: 'Theme',
      settingsFontLabel: 'Digit size',
      settingsMistakesLabel: 'Error counter',
      settingsLangLabel: 'Language',

      themeNameMidnight: 'Midnight',
      themeNameTwilight: 'Twilight',
      themeNameClassic: 'Classic',
      themeNamePaper: 'Paper',

      fontNameSmall: 'Small',
      fontNameMedium: 'Medium',
      fontNameLarge: 'Large',

      victory: 'Victory! 🎉',
      victoryTime: 'Time',
      gameOver: 'Game Over',
      gameOverSub: 'Too many mistakes',
      modalNewGame: 'New Game',

      confirmTitle: 'New game?',
      confirmSub: 'Current progress will be lost',
      confirmCancel: 'Cancel',
      confirmOk: 'Start',

      mistakesExceededTitle: 'Error limit exceeded',
      mistakesExceededSub: 'The error limit for this difficulty has been exceeded',
      mistakesDisable: 'Disable counter',
    },
  };

  let _lang = 'ru';
  let _onChange = null;

  function currentLang() { return _lang; }

  function t(key) {
    return (TRANSLATIONS[_lang] || TRANSLATIONS.ru)[key] || key;
  }

  function setLang(lang) {
    if (!LANGS.includes(lang)) return;
    _lang = lang;
    localStorage.setItem('sudoku-lang', lang);
    document.documentElement.lang = lang;
    _applyStatic();
    if (_onChange) _onChange(lang);
  }

  function loadLang() {
    const saved = localStorage.getItem('sudoku-lang');
    _lang = LANGS.includes(saved) ? saved : 'ru';
    document.documentElement.lang = _lang;
    _applyStatic();
  }

  function onChange(cb) { _onChange = cb; }

  function _applyStatic() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const attr = el.dataset.i18nAttr;
      if (attr) {
        el.setAttribute(attr, t(key));
      } else {
        el.textContent = t(key);
      }
    });
  }

  return { t, currentLang, setLang, loadLang, onChange };
})();
