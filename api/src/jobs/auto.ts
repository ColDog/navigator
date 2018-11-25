import * as apps from "../repo/apps";
import * as releases from "../repo/releases";
import * as builds from "../repo/builds";
import * as log from "../log";

export async function scanApps() {
  const appList = await apps.list();
  for (const appMeta of appList) {
    const app = await apps.get(appMeta.name);
    for (const stage of app.stages) {
      if (stage.auto) {
        const unreleased = await builds.listUnreleased(app.name, stage.name);
        for (const build of unreleased) {
          log.info("releasing build automatically", build);
          releases.insert(
            { email: "auto-deploy@navigator.io" },
            {
              app: build.app,
              stage: build.stage,
              version: build.version
            }
          );
        }
      }
    }
  }
}

export async function run() {
  log.info("starting auto worker");
  while (true) {
    try {
      await scanApps();
    } catch (e) {
      log.exception("auto worker: failed to scan apps", e);
    }
    await sleep(10000);
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
