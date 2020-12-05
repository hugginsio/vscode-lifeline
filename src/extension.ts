import { ExtensionContext, window, StatusBarAlignment, StatusBarItem, Disposable, WorkspaceConfiguration, workspace } from 'vscode';
import { Position } from './constants';
import moment = require('moment');
import sysInfo = require('systeminformation');

export function activate(context: ExtensionContext) {
  const lifelineStatus = new Lifeline();
  context.subscriptions.push(lifelineStatus);
  context.subscriptions.push(workspace.onDidChangeConfiguration(() => lifelineStatus.updateConfig()));
}

export function deactivate() { return null; }

export class Lifeline {
  private batteryStatus!: StatusBarItem;
  private config: WorkspaceConfiguration;
  private disposable: Disposable;
  private oldconfig: WorkspaceConfiguration;
  private timeStatus!: StatusBarItem;

  constructor() {
    const subscriptions: Disposable[] = [];
    this.config = workspace.getConfiguration('lifeline');
    this.disposable = Disposable.from(...subscriptions);
    this.oldconfig = workspace.getConfiguration('lifeline');

    this.createLifeline();
  }

  dispose() {
    this.timeStatus.dispose();
    this.batteryStatus.dispose();
    this.disposable.dispose();
  }

  updateConfig() {
    this.oldconfig = this.config;
    this.config = workspace.getConfiguration('lifeline');
    this.updateTime();
    this.updateBattery();

    if (this.oldconfig != this.config) {
      this.dispose();
      this.createLifeline();
    }
  }

  private createLifeline() {
    let timeStatusPosition = Position.RIGHT;
    let batteryStatusPosition = Position.LEFT;

    if (this.config.get('swap')) {
      [timeStatusPosition, batteryStatusPosition] = [batteryStatusPosition, timeStatusPosition];
    }

    this.timeStatus = window.createStatusBarItem(StatusBarAlignment.Right, timeStatusPosition);
    this.batteryStatus = window.createStatusBarItem(StatusBarAlignment.Right, batteryStatusPosition);
    
    this.updateTime();
    this.updateBattery();
    this.batteryStatus.show();
    this.timeStatus.show();
  }

  private updateTime() {
    // Display time immediately to prevent UI flash
    this.timeStatus.text = moment().format(this.config.get('clock.format'));

    return setInterval(() => {
      this.timeStatus.text = moment().format(this.config.get('clock.format'));
      this.updateBattery();
    }, 1000);
  }

  private async updateBattery() {
    const battery = Math.min(Math.max((await sysInfo.battery()).percent, 0), 100);
    const charging = (await sysInfo.battery()).ischarging ? '+' : '';
    return this.batteryStatus.text = `${charging}${battery}%`;
  }
}