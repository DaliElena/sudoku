class History {
  constructor() {
    this._stack = [];
  }

  push(snapshot) {
    this._stack.push(snapshot);
  }

  undo() {
    return this._stack.pop() ?? null;
  }

  clear() {
    this._stack = [];
  }

  get size() {
    return this._stack.length;
  }
}
