import db from "../db";
import * as Knex from "knex";

type Subscription = (tx: Knex.Transaction, payload: object) => Promise<any>;

export const subscriptions: { [event: string]: Subscription[] } = {};

export interface Event {
  name: string;
  created: string;
  payload: object;
}

export function subscribe(name: string, sub: Subscription) {
  subscriptions[name] = subscriptions[name] || [];
  subscriptions[name].push(sub);
}

export async function emit(name: string, payload: object) {
  db.transaction(async tx => {
    await tx
      .insert({
        name,
        payload: JSON.stringify(payload),
        created: new Date().toISOString()
      })
      .into("events");

    for (let fn of subscriptions[name]) {
      await fn(tx, payload);
    }
  });
}
