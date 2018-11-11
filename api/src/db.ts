import * as config from './config'
import * as knex from 'knex';

export default knex(config.database[config.environment]);
