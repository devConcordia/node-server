import {Executor} from '../Executor.mjs';

/** SqliteExecutor
 *
 */
export class SqliteExecutor extends Executor {

	#db = null;
	#tables = null;

	/**
	 *
	 *  @ref https://nodejs.org/api/sqlite.html
	 *  import {DatabaseSync} from 'node:executors'
	 *
	 *	@param {DatabaseSync} database
	 */
	constructor(database) {

		super();

		this.#db = database;

		const columnsRows = this.all(
			'select ' +
			' m.name as table_name, ' +
			' p.* ' +
			'from sqlite_master as m ' +
			' join pragma_table_info(m.name) as p ' +
			'where m.type = \'table\' and m.name not like \'sqlite_%\';'
		);

		const tables = Object.create(null);

		for (const row of columnsRows) {

			if (!tables[row.table_name])
				tables[row.table_name] = [];

			tables[row.table_name].push(row);

		}

		this.#tables = tables;

	}

	/** getTableInfo
	 *
	 * @param tableName
	 * @return {*}
	 */
	getTableInfo(tableName) {

		if (tableName in this.#tables)
			return this.#tables[tableName];

		return this.all(`PRAGMA table_info(${tableName});`);

	}

	/** all
	 *
	 * @param {String} sql
	 * @param {Object} params
	 * @returns {*}
	 */
	all(sql, params = {}) {

		try {

			if (Array.isArray(params))
				return this.#db.prepare(sql).all(...params);

			return this.#db.prepare(sql).all(params);

		} catch (err) {

			throw new Error(`${this.constructor.name}.all: ${err.message}`);

		}

	}

	/** one
	 *
	 * @param {String} sql
	 * @param {Object} params
	 * @returns {*}
	 */
	one(sql, params = {}) {

		try {

			if (Array.isArray(params))
				return this.#db.prepare(sql).get(...params);

			return this.#db.prepare(sql).get(params);

		} catch (err) {

			throw new Error(`SqliteExecutor.one: ${err.message}`);

		}

	}

	/** run
	 *
	 * @param {String} sql
	 * @param {Object|Array} params
	 * @returns {*}
	 */
	run(sql, params = {}) {

		try {

			if (Array.isArray(params))
				return this.#db.prepare(sql).run(...params);

			return this.#db.prepare(sql).run(params);

		} catch (err) {

			throw new Error(`${this.constructor.name}.run: ${err.message}`);

		}

	}

	/**
	 *
	 * @param {string} sql
	 */
	execute(sql) {

		this.#db.exec(sql);

	}

	/**
	 *
	 */
	transaction() {

		this.execute('begin transaction;');

	}

	/**
	 *
	 */
	commit() {

		this.execute('commit;');

	}


	/**
	 *
	 */
	rollback() {

		this.execute('rollback;');

	}

}
