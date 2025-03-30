import { EventEmitter } from 'events';

type Action = () => void;

export class Schedule extends EventEmitter {
  handle?: NodeJS.Timeout;
  action: (schedule: Schedule) => void;
  time: number;
  constructor(action: (schedule: Schedule) => void, time: number) {
    super();
    this.handle = undefined;
    this.action = action;
    this.time = time;
    this.on('interval', () => action(this));
  }
  start(): void {
    if (!this.handle) {
      this.handle = setInterval(() => {
        this.emit('interval');
      }, this.time);
    }
  }
  stop(): void {
    if (this.handle) {
      clearInterval(this.handle);
      this.handle = undefined;
    }
  }
}

export class Timer extends EventEmitter {
  handle?: NodeJS.Timeout;
  action: Action;
  time: number;
  constructor(action: Action, time: number) {
    super();
    this.handle = undefined;
    this.action = action;
    this.time = time;
    this.on('timeout', action);
  }
  start(): void {
    if (!this.handle) {
      this.handle = setTimeout(() => {
        this.emit('timeout');
        this.stop();
      }, this.time);
    }
  }
  stop(): void {
    if (this.handle) {
      clearTimeout(this.handle);
      this.handle = undefined;
    }
  }
}

export class SequentialTimer extends EventEmitter {
  handle?: NodeJS.Timeout;
  actions: Action[];
  time: number;
  constructor(time: number) {
    super();
    this.handle = undefined;
    this.actions = [];
    this.time = time;
    this.on('timeout', () => {
      const action = this.actions.shift();
      action && action();
      this.stop();
      if (this.actions.length) this.start();
    });
  }
  start(action?: Action | Action[]): void {
    if (action instanceof Array) action.forEach((a) => this.actions.push(a));
    else if (action) this.actions.push(action);
    if (!this.handle) {
      this.handle = setTimeout(() => {
        this.emit('timeout');
      }, this.time);
    }
  }
  stop(): void {
    if (this.handle) {
      clearTimeout(this.handle);
      this.handle = undefined;
    }
  }
  clear(): void {
    if (this.handle) {
      clearTimeout(this.handle);
      this.handle = undefined;
    }
    this.actions = [];
  }
}
