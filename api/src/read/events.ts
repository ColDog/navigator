import db from "../db";

export interface Event {
  id: string;
  name: string;
  created: string;
  payload: object;
}

export async function listByApp(app: string): Promise<Event[]> {
  let q = db
    .select("*")
    .from("events")
    .orderBy("id", "desc")
    .limit(25);
  if (app) {
    q = q.where("app", app);
  }
  return await q.map((evt: any) => ({
    ...evt,
    payload: JSON.parse(evt.payload),
  }));
}
