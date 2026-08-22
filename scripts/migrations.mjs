import fs from 'node:fs';
import process from 'node:process';
import {DatabaseSync} from 'node:sqlite';
import {SqliteExecutor} from '../src/core/database/executors/SqliteExecutor.mjs';
import {CreateDatabaseSchemaUseCase} from '../src/modules/ops/application/CreateDatabaseSchemaUseCase.mjs';
import {MigrationRepository} from '../src/modules/ops/infrastructure/repositories/MigrationRepository.mjs';
import {RunMigrationsUseCase} from '../src/modules/ops/application/RunMigrationsUseCase.mjs';
import {RunSqlUseCase} from '../src/modules/ops/application/RunSqlUseCase.mjs';

const databasePath = process.env.DB_MAIN_PATH;
const configPath = process.env.DB_MAIN_CONFIG;

if (!fs.existsSync(databasePath))
	fs.mkdirSync(databasePath.split('/').slice(0, -1).join('/'), {recursive: true});

///
const database = new DatabaseSync(databasePath, {});
const executor = new SqliteExecutor(database);

executor.execute('pragma foreign_keys = ON;');
executor.execute('pragma synchronous = FULL;');
executor.execute('pragma journal_mode = WAL;');

/// ops_migrations table need exists before instantiate the repository
executor.execute(
	'create table if not exists ops_migrations ( ' +
	' id integer primary key autoincrement, ' +
	' filename text unique not null, ' +
	' checksum text not null, ' +
	' executed_at datetime default current_timestamp );'
);

///
const repository = new MigrationRepository(executor);
const migrationUseCase = new RunMigrationsUseCase(console, repository);
const createDatabaseSchemaUseCase = new CreateDatabaseSchemaUseCase(executor);
const runSqlUseCase = new RunSqlUseCase(executor);

///
migrationUseCase.execute(configPath + '/migrations');
createDatabaseSchemaUseCase.execute(configPath, '/schema.sql');
runSqlUseCase.execute(configPath, '/initial-data.sql');
