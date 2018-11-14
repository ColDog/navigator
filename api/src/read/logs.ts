import db from "../db";
import * as crypto from "crypto";
import _ = require("lodash");

export interface Log {
  line: string;
  release: string;
  created: string;
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
    .update(`${_.get(key, "id", "-")}`)
    .digest("hex");
}
