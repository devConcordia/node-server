///
import process from 'node:process';
import {DatabaseSync} from 'node:sqlite';
///
import {SqliteMigration} from '../src/core/database/migrations/SqliteMigration.mjs';

///
const database = new DatabaseSync(process.env.DB_MAIN_PATH);
const migrations = new SqliteMigration(database, process.env.DB_MAIN_CONFIG);

migrations.execute('/migrations');
migrations.refreshSchema('/schema.sql');
