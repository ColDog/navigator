import db from "../db";
import * as crypto from "crypto";
import _ = require("lodash");

export interface Event {
  name: string;
  created: string;
  payload: object;
}

export async function emit(name: string, payload: object) {
  await db
    .insert({
      name,
      payload: JSON.stringify(payload),
      created: new Date().toISOString()
    })
    .into("events");
}

export async function list(): Promise<Event[]> {
  return await db
    .select("*")
    .from("events")
    .orderBy("id", "asc")
    .limit(15)
    .map((ev: any) => ({
      ...ev,
      payload: JSON.parse(ev.payload)
    }));
}

export async function getKey(): Promise<string> {
  const key = await db
    .table("events")
    .max({ id: "id" })
    .first();
  return crypto
    .createHash("md5")
    .update(`${_.get(key, "id", "-")}`)
    .digest("hex");
}
