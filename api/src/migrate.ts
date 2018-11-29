import * as log from "./log";
import db from "./db";

(async () => {
  log.info("migrating database");
  await db.migrate.latest();
  log.info("finished");
  process.exit(0);
})();
