import { ApplicationInfo } from "../models/applicationInfo";
import { PackageJson } from "../models/packageJson";
import { Service } from "typedi";
import * as path from "path";
import * as fs from "fs";

@Service()
export class ApplicationInfoService {

  getApplicationInfo(): ApplicationInfo {

    let packageJsonLocation: string | undefined = "package.json";
    if (!fs.existsSync(packageJsonLocation)) {
      packageJsonLocation = path.join("..", packageJsonLocation);
      if (!fs.existsSync(packageJsonLocation)) {
        packageJsonLocation = undefined;
      }
    }
    const packageJson: PackageJson | undefined = packageJsonLocation === undefined ? undefined : 
      JSON.parse(fs.readFileSync(packageJsonLocation, "utf8")) as PackageJson;
    const currentDateTime: Date = new Date();

    return {
      name: packageJson === undefined ? "" : packageJson.name,
      description: packageJson === undefined ? "" : packageJson.description,
      version: packageJson === undefined ? "" : packageJson.version,
      nodeVersion: process.version,
      timestamp: currentDateTime,
      processPid: process.pid,
      platform: process.platform,
      uptimeInSeconds: process.uptime()
    };

  }
}