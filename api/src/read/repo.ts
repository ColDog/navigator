import * as knex from "knex";
import db from "../db";
import { NotFoundError } from "../errors";

export class QuerySet<T> {
  name: string;
  load: (data: any) => T;

  constructor(name: string, load: (data: any) => T) {
    this.load = load;
    this.name = name;
  }

  public async find(cb: (db: knex) => knex.QueryBuilder): Promise<T> {
    const data = await cb(db);
    if (!data) {
      throw new NotFoundError(`${this.name} Does not exist`);
    }
    return this.load(data);
  }

  public async query(cb: (db: knex) => knex.QueryBuilder): Promise<T[]> {
    return await cb(db).map(this.load);
  }

  public async exists(cb: (db: knex) => knex.QueryBuilder): Promise<boolean> {
    const data = await cb(db);
    return !!data;
  }

  public table(name: string) {
    return db.table(name);
  }

  public db() {
    return db
  }
}
