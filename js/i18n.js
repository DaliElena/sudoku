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

      hint: 'Подсказка',
      hintNoEmpty: 'Все клетки заполнены!',
      hintRow: 'строке',
      hintCol: 'столбце',
      hintBox: 'блоке 3×3',
      hintNakedOnly: 'В эту клетку подходит только',
      hintNakedBecause: 'Остальные цифры ({list}) уже заняты в этой строке, столбце или блоке.',
      hintHiddenRow: 'Цифра {v} в строке {n} может встать только в эту клетку — во всех остальных пустых клетках строки она уже исключена.',
      hintHiddenCol: 'Цифра {v} в столбце {n} может встать только в эту клетку — во всех остальных пустых клетках столбца она уже исключена.',
      hintHiddenBox: 'Цифра {v} в этом блоке 3×3 может встать только в эту клетку — во всех остальных пустых клетках блока она уже исключена.',
      hintNoHint: 'Нет простой подсказки для текущего состояния доски',
      hintClose: 'Понятно',
      rotatePlease: 'Пожалуйста, поверните устройство',
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

      hint: 'Hint',
      hintNoEmpty: 'All cells are filled!',
      hintRow: 'row',
      hintCol: 'column',
      hintBox: '3×3 box',
      hintNakedOnly: 'The only digit that fits here is',
      hintNakedBecause: 'All other digits ({list}) are already taken in this row, column, or box.',
      hintHiddenRow: 'Digit {v} can only go here in row {n} — it is excluded from all other empty cells in the row.',
      hintHiddenCol: 'Digit {v} can only go here in column {n} — it is excluded from all other empty cells in the column.',
      hintHiddenBox: 'Digit {v} can only go here in this 3×3 box — it is excluded from all other empty cells in the box.',
      hintNoHint: 'No simple hint available for the current board state',
      hintClose: 'Got it',
      rotatePlease: 'Please rotate your device',
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
