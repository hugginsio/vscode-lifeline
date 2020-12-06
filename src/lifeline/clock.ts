import moment = require('moment');
import { StatusBarAlignment, StatusBarItem, window } from 'vscode';
import { Position } from '../constants';
import { ExtensionConfiguration } from '../interfaces';
import { utils } from './utils';

export class Clock {
  private config: ExtensionConfiguration;
  private clock: StatusBarItem;
  private interval: NodeJS.Timeout;

  constructor(currentConfig: ExtensionConfiguration) {
    this.config = currentConfig;
    this.clock = this.createClock();
    this.interval = this.startClock();
    
    this.clock.show();
  }

  getClock(): StatusBarItem {
    return this.clock;
  }

  updateConfig() {
    this.config = utils.getConfig();
    this.redraw();
  }

  dispose() {
    this.clock.dispose();
    clearInterval(this.interval);
  }

  redraw() {
    this.dispose();
    this.clock = this.createClock();
    this.interval = this.startClock();
    this.clock.show();
  }

  private createClock(): StatusBarItem {
    return window.createStatusBarItem(StatusBarAlignment.Right, this.config.swap ? Position.LEFT : Position.RIGHT);
  }

  private startClock(): NodeJS.Timeout {
    this.clock.text = moment().format(this.config.clockFormat);
    
    return setInterval(() => {
      this.clock.text = moment().format(this.config.clockFormat);
    }, this.config.clockInterval);
  }
}