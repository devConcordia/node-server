///
import {DatabaseSync} from 'node:sqlite';
///
import {SqliteExecutor} from '../../core/database/executors/SqliteExecutor.mjs';

/** MainDatabaseExecutor
 *
 */
export class MainDatabaseExecutor extends SqliteExecutor {

	/**
	 *
	 * @param {AppSettings} settings
	 */
	constructor(settings) {

		const appDatabase = new DatabaseSync(settings.DB_MAIN_PATH, {});

		appDatabase.exec('PRAGMA journal_mode = WAL;');
		appDatabase.exec('PRAGMA synchronous = NORMAL;');
		appDatabase.exec("PRAGMA cache_size = -2000;");

		super(appDatabase);
		
	}

}