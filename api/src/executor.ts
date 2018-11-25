import { spawn } from "child_process";
import * as logs from "./repo/logs";
import * as log from "./log";
import * as _ from "lodash";

export function sh(root: string, args: string[], logCb: (line: string) => void) {
  return new Promise((resolve, reject) => {
    const cmd = spawn(root, args);
    const logger = () => {
      let buffer = "";
      return (chunk: Buffer) => {
        buffer += chunk.toString();

        let eolIndex;
        while ((eolIndex = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, eolIndex + 1); // Include EOL.
          logCb(line);
          buffer = buffer.slice(eolIndex + 1); // Reset the buffer.
        }
        if (buffer.length > 0) {
          logCb(buffer);
        }
      };
    };

    // Give up after 15 seconds.
    const timeout = setTimeout(() => {
      cmd.kill();
      logCb("deploy timed out\n");
      reject(new Error(`deploy timed out after 120s`));
    }, 120000);

    cmd.stdout.on("data", logger());
    cmd.stderr.on("data", logger());

    cmd.on("close", code => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`exit code ${code}`));
    });

    cmd.on("error", err => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

export interface Deploy {
  executable: string;
  values: object;
  cluster: string;
  namespace: string;
  stage: string;
  app: string;
  chart: string;
  release: string;
  remove: boolean;
  version: string;
}

export async function execute(deploy: Deploy) {
  const args = [
    "-r",
    deploy.release,
    "-b",
    deploy.chart,
    "-c",
    deploy.cluster,
    "-n",
    deploy.namespace,
    "-s",
    deploy.stage,
    "-a",
    deploy.app,
    "-v",
    deploy.version,
    "-q",
    `${JSON.stringify(deploy.values)}`
  ];
  if (deploy.remove) {
    args.push("-d", "true");
  }
  await sh(deploy.executable, args, (line: string) => {
    log.info(`release: ${deploy.release}`, line.trimRight());
    logs.log(deploy.release, line.trimRight()).catch(err => {
      log.exception("writing release log failed", err);
    });
  });
}
