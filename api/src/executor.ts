import { spawn } from "child_process";
import * as logs from "./repo/logs";
import { Build } from "./repo/builds";
import { Cluster } from "./repo/apps";
import { Release } from "./repo/releases";

export async function sh(
  root: string,
  args: string[],
  log: (line: string) => void
) {
  return new Promise(async (resolve, reject) => {
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

    cmd.stdout.on("data", logger());
    cmd.stderr.on("data", logger());

    cmd.on("close", code => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`exit code ${code}`));
    });

    cmd.on("error", err => {
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
  release: string;
  version: string;
}

export function values(build: Build, cluster: Cluster, release: Release) {
  return Object.assign({}, build.values, cluster.values, {
    image: { tag: build.version },
    version: build.version,
  });
}

export async function execute(deploy: Deploy) {
  const args = [
    "-r",
    deploy.release,
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
  await sh(deploy.executable, args, async (line: string) => {
    console.log(`release: ${deploy.release}`, chomp(line));
    try {
      await logs.log(deploy.release, chomp(line));
    } catch (e) {
      console.error(e);
    }
  });
}
