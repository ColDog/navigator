import db from "../db";
import _ = require("lodash");

/**
 * Special use case, avoids using the event store for performance.
 * @param release
 * @param line
 */
export async function log(release: string, line: string) {
  await db
    .insert({ release, line, created: new Date().toISOString() })
    .into("logs");
}
