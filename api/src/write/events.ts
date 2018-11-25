import db from "../db";
import * as Knex from "knex";
import { User } from "../auth";

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

export async function emit(user: User, name: string, payload: any) {
  db.transaction(async tx => {
    await tx
      .insert({
        name,
        app: payload.app || null,
        subject: payload.subject || null,
        payload: JSON.stringify(payload),
        created: new Date().toISOString()
      })
      .into("events");

    for (const fn of subscriptions[name]) {
      await fn(tx, payload);
    }
  });
}
