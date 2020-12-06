import { battery as batteryInfo } from "systeminformation";
import { workspace } from "vscode";
import { ExtensionConfiguration } from "../interfaces";

export class utils {
  static getConfig(): ExtensionConfiguration {
    const workspaceConfig = workspace.getConfiguration('lifeline');

    return {
      swap: workspaceConfig.get('swap') as boolean,
      clockFormat: workspaceConfig.get('clock.format') as string,
      clockInterval: workspaceConfig.get('clock.interval') as number,
      batteryInterval: workspaceConfig.get('battery.interval') as number
    }
  }

  static async batteryCheck(): Promise<boolean> {
    return (await batteryInfo()).hasbattery;
  }
}