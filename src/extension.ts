import { ExtensionContext, workspace } from 'vscode';
import { Battery } from './lifeline/battery';
import { Clock } from './lifeline/clock';
import { utils } from './lifeline/utils';

export function activate(context: ExtensionContext) {
  const lifelineClock = new Clock(utils.getConfig());
  const lifelineBattery = new Battery(utils.getConfig());
  context.subscriptions.push(lifelineClock);
  
  utils.batteryCheck().then((val) => {
    if (val) {
      context.subscriptions.push(lifelineBattery);
    } else {
      lifelineBattery.dispose();
    }
  });
  
  context.subscriptions.push(workspace.onDidChangeConfiguration(() => {
    lifelineClock.updateConfig();
    lifelineBattery.updateConfig();
  }));
}

export function deactivate() {
  return null; 
}