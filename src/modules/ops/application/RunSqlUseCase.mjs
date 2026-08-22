import fs from 'node:fs';
import path from 'node:path';

/**
 *
 */
export class RunSqlUseCase {

	constructor(executor) {
		this.executor = executor;
	}

	execute(dir, filename) {

		const filepath = path.join(dir, filename);

		if (!fs.existsSync(filepath))
			throw new Error(`${this.constructor.name}.execute: '${filepath}' does not exist`);

		const sql = fs.readFileSync(filepath, 'utf8');

		const executor = this.executor;

		try {

			executor.transaction();
			executor.execute(sql);
			executor.commit();

		} catch (error) {

			executor.rollback();

			throw error;

		}

	}

}