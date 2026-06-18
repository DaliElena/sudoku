class Timer {
  constructor() {
    this._seconds = 0;
    this._interval = null;
    this._onTick = null;
  }

  onTick(cb) {
    this._onTick = cb;
  }

  start() {
    if (this._interval) return;
    this._interval = setInterval(() => {
      this._seconds++;
      this._onTick?.(this._seconds);
    }, 1000);
  }

  pause() {
    clearInterval(this._interval);
    this._interval = null;
  }

  reset() {
    this.pause();
    this._seconds = 0;
  }

  get seconds() {
    return this._seconds;
  }

  set seconds(val) {
    this._seconds = val;
  }
}
