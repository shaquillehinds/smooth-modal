import { EventEmitter } from 'events';

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
  action: () => void;
  time: number;
  constructor(action: () => void, time: number) {
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
