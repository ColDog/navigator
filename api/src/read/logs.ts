import db from "../db";

export interface Log {
  id: string;
  line: string;
  release: string;
  created: string;
}

export async function list(release: string): Promise<Log[]> {
  return await db
    .select(["id", "line", "created"])
    .from("logs")
    .where({ release })
    .orderBy("id", "asc");
}
