import * as knex from "knex";
import db from "../db";
import { NotFoundError } from "../errors";

class QuerySetOpts<T> {
  name: string;
  load?: (data: any) => T;
  created?: boolean = false;
  modified?: boolean = false;
  serialize?: string[] = [];
  booleans?: string[] = [];
}

export interface Options<T> extends QuerySetOpts<T> {}

export class QuerySet<T> extends QuerySetOpts<T> {
  constructor(options: Options<T>) {
    super();
    Object.assign(this, options);
  }

  public async find(cb: (db: knex) => knex.QueryBuilder): Promise<T> {
    const data = await cb(db);
    if (!data) {
      throw new NotFoundError(`${this.name} Does not exist`);
    }
    return this.loader(data);
  }

  public async query(cb: (db: knex) => knex.QueryBuilder): Promise<T[]> {
    return await cb(db).map(this.loader);
  }

  public async exists(cb: (db: knex) => knex.QueryBuilder): Promise<boolean> {
    const data = await cb(db);
    return !!data;
  }

  public update(q: knex.QueryBuilder, obj: any): knex.QueryBuilder {
    if (this.modified) obj.modified = new Date().toISOString();
    for (let field of this.serialize) {
      if (obj[field]) obj[field] = JSON.stringify(obj[field]);
    }
    return q.update(obj);
  }

  public create(q: knex.QueryBuilder, obj: any): knex.QueryBuilder {
    if (this.modified) obj.modified = new Date().toISOString();
    if (this.created) obj.created = new Date().toISOString();
    for (let field of this.serialize) {
      if (obj[field]) obj[field] = JSON.stringify(obj[field]);
    }
    return q.insert(obj);
  }

  public table(name: string) {
    return db.table(name);
  }

  private loader = (data: any): T => {
    for (let field of this.serialize) {
      if (data[field]) data[field] = JSON.parse(data[field]);
    }
    for (let field of this.booleans) {
      data[field] = !!data[field];
    }
    if (!this.load) {
      return data;
    }
    return this.load(data);
  };

  public db() {
    return db;
  }
}
