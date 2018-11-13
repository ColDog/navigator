import db from "../db";
import * as crypto from "crypto";

export interface Log {
  line: string;
  release: string;
  created: string;
}

export async function log(release: string, line: string) {
  await db
    .insert({ release, line, created: new Date().toISOString() })
    .into("logs");
}

export async function list(release: string): Promise<Log[]> {
  return await db
    .select(["line", "created"])
    .from("logs")
    .where("release", release)
    .orderBy("id", "asc");
}

export async function getKey(release: string): Promise<string> {
  const key = await db
    .table("logs")
    .max({ id: "id" })
    .where("release", release)
    .first();
  return crypto
    .createHash("md5")
    .update(`${key.id}`)
    .digest("hex");
}
