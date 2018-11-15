import db from "../db";

export interface Log {
  id: string;
  line: string;
  release: string;
  created: string;
}

export async function list(release?: string, limit?: number): Promise<Log[]> {
  let query = db
    .select(["id", "line", "created"])
    .from("logs")
    .orderBy("id", "asc");
  if (limit) {
    query = query.limit(limit);
  }
  if (release) {
    query = query.where({ release });
  }
  return await query;
}
