import process from 'node:process';
import {DatabaseSync} from 'node:sqlite';
import {SqliteExecutor} from '../src/core/database/executors/SqliteExecutor.mjs';
import {MigrationRepository} from '../src/modules/ops/infrastructure/repositories/MigrationRepository.mjs';
import {MigrationFileReader} from '../src/modules/ops/infrastructure/io/MigrationFileReader.mjs';
import {RunMigrationsUseCase} from '../src/modules/ops/application/RunMigrationsUseCase.mjs';

const databasePath = process.env.DB_MAIN_PATH;
const configPath = process.env.DB_MAIN_CONFIG;

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

const repository = new MigrationRepository(executor);
const fileReader = new MigrationFileReader(configPath + '/migrations');

const migrationUseCase = new RunMigrationsUseCase(console, repository, fileReader);

migrationUseCase.execute();



