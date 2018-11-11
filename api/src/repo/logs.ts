import db from "../db";

export interface Log {
  line: string;
  release: string;
  created: Date;
}

export async function log(release: string, line: string) {
  await db.insert({ release, line }).into("logs");
}

export async function list(release: string): Promise<Log[]> {
  return await db
    .select(["line", "created"])
    .from("logs")
    .where("release", release)
    .orderBy("created", "desc");
}
