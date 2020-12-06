import { battery as batteryInfo } from "systeminformation";
import { workspace } from "vscode";
import { ExtensionConfiguration } from "../interfaces";

export class utils {
  static getConfig(): ExtensionConfiguration {
    const workspaceConfig = workspace.getConfiguration('lifeline');

    return {
      clockFormat: workspaceConfig.get('clock.format') as string,
      swap: workspaceConfig.get('swap') as boolean
    }
  }

  static async batteryCheck(): Promise<boolean> {
    return (await batteryInfo()).hasbattery;
  }
}