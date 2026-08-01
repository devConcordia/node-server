import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';

/** getChecksum
 *
 * @param content
 * @returns {String}
 */
function getChecksum(content) {

	return crypto.createHash('sha256').update(content).digest('hex');

}

/** SqliteMigration
 *
 */
export class SqliteMigration {

	#configPath = null;
	#database = null;

	/**
	 *
	 * @param {DatabaseSync} database
	 * @param configPath
	 */
	constructor(database, configPath) {

		this.#database = database;
		this.#configPath = configPath;

		///
		database.exec(
			'create table if not exists migrations ( ' +
			' id integer primary key autoincrement, ' +
			' filename text unique not null, ' +
			' checksum text not null, ' +
			' executed_at datetime default current_timestamp )'
		);

	}

	/**
	 *
	 * @returns {boolean}
	 */
	isEmpty() {

		const result = this.#database.prepare(
			'select 1 from sqlite_master ' +
			'where type = \'table\' ' +
			'  and name not like \'sqlite_%\' ' +
			'  and name != \'migrations\' ' +
			'limit 1'
		).get();

		return !result;

	}

	/**
	 *
	 * @param {String} filename
	 */
	findOne(filename) {

		return this.#database
			.prepare('select * from migrations where filename = ?')
			.get(filename);

	}

	/**
	 *
	 * @param {String} filename
	 * @param {String} hash
	 */
	register(filename, hash) {

		return this.#database
			.prepare('insert into migrations (filename, checksum) values (?, ?)')
			.run(filename, hash);

	}

	/**
	 *
	 * @param {String} dir
	 */
	execute(dir = '/migrations') {

		const local = path.join(this.#configPath, dir);

		if (!fs.existsSync(local))
			throw new Error(`Migration '${local}' does not exist`);

		const files = fs.readdirSync(local).sort();

		for (const file of files) {

			if (!file.endsWith('.sql')) continue;

			const filepath = path.join(local, file);
			const sql = fs.readFileSync(filepath, 'utf8');
			const hash = getChecksum(sql);
			const migration = this.findOne(file);

			if (migration) {

				if (migration.checksum !== hash)
					throw new Error(`[SqliteMigration] migration "${file}" has been modified.`);

				console.log(`[SqliteMigration] skipping "${file}"`);
				continue;

			}

			try {

				this.#database.exec('BEGIN');

				this.#database.exec(sql);
				this.register(file, hash);

				this.#database.exec('COMMIT');

				console.log(`[SqliteMigration] "${file}" executed successfully.`);

			} catch (error) {

				console.error(`[SqliteMigration] error executing "${file}"`);
				throw error;

			}
		}

	}

	/**
	 *
	 * update the schema.sql
	 *
	 * @param {String} filename
	 */
	refreshSchema(filename = 'schema.sql') {

		const filepath = path.join(this.#configPath, filename);

		const rows = this.#database.prepare(
			'select sql from sqlite_master ' +
			'where sql is not null ' +
			'  and type in (\'table\', \'index\', \'trigger\', \'view\') ' +
			'order by type, name;'
		).all();

		fs.writeFileSync(filepath, rows.map(row => row.sql).join(';\n\n'));

		console.log('[SqliteMigration] schema.sql updated');

	}

	/**
	 *
	 * restore from schema.
	 *
	 * @param {String} filename
	 */
	restoreSchema(filename = 'schema.sql') {

		const filepath = path.join(this.#configPath, filename);

		console.log(`[SqliteMigration] start restoring "${filepath}".`);

		try {

			const sql = fs.readFileSync(filepath, 'utf8');

			this.#database.exec('BEGIN');
			this.#database.exec(sql);
			this.#database.exec('COMMIT');

			console.log(`[SqliteMigration] "${filepath}" executed successfully.`);

		} catch (error) {

			console.error(`[SqliteMigration] error restore "${filepath}"`);

			throw error;

		}

	}

}
