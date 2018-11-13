import { spawn } from "child_process";
import * as logs from "./repo/logs";
import { Build } from "./repo/builds";
import { Cluster, Stage } from "./repo/apps";
import { Release } from "./repo/releases";
import * as log from "./log";

export function sh(root: string, args: string[], log: (line: string) => void) {
  return new Promise((resolve, reject) => {
    const cmd = spawn(root, args);
    const logger = () => {
      let buffer = "";
      return (chunk: Buffer) => {
        buffer += chunk.toString();

        let eolIndex;
        while ((eolIndex = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, eolIndex + 1); // Include EOL.
          log(line);
          buffer = buffer.slice(eolIndex + 1); // Reset the buffer.
        }
        if (buffer.length > 0) {
          log(buffer);
        }
      };
    };

    // Give up after 15 seconds.
    const timeout = setTimeout(() => {
      log("deploy timed out\n");
      cmd.kill("SIGTERM");
    }, 15000);

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

function chomp(line: string): string {
  const re = /\r?\n$/u;
  const match = re.exec(line);
  if (!match) return line;
  return line.slice(0, match.index);
}

interface Deploy {
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

export function values(build: Build, cluster: Cluster, release: Release) {
  return Object.assign({}, build.values, cluster.values, {
    image: { tag: build.version },
    version: build.version
  });
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
    log.info(`release: ${deploy.release}`, chomp(line));
    logs.log(deploy.release, chomp(line)).catch(err => {
      log.exception("writing release log failed", err);
    });
  });
}
