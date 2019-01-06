import * as config from "./config";
import * as knex from "knex";
import * as log from './log';

log.info("db connection", config.database[config.environment].client);

export default knex(config.database[config.environment]);
