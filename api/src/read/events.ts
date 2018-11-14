import db from "../db";

export interface Event {
  id: string;
  name: string;
  created: string;
  payload: object;
}

export async function list(): Promise<Event[]> {
  return await db
    .select("*")
    .from("events")
    .orderBy("id", "asc")
    .limit(25)
    .map((evt: any) => ({
      ...evt,
      payload: JSON.parse(evt.payload)
    }));
}
