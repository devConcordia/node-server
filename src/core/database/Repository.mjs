import {QueryBuilder} from './QueryBuilder.mjs';
import {Criteria} from './Criteria.mjs';
import {Executor} from './Executor.mjs';

/** Repository
 *
 */
export class Repository {

	get TABLE_NAME() {
		throw new Error(`${this.constructor.name}.TABLE_NAME: is undefined`);
	}

	get ENTITY_CLASS() {
		throw new Error(`${this.constructor.name}.ENTITY_CLASS: is undefined`);
	}

	#executor = null;
	#primaryKey = null;
	#schema = new Map();

	/**
	 *
	 *	@param {Executor} executor
	 */
	constructor(executor) {

		if (!(executor instanceof Executor))
			throw new Error(`${this.constructor.name}: @param 'executor' is not a Executor`);

		this.#executor = executor;

		///
		const columns = executor.getTableInfo(this.TABLE_NAME);

		for (const column of columns) {

			this.#schema.set(column.name, {
				type: column.type,
				nullable: column.notnull === 0,
				defaultValue: column.dflt_value,
				primaryKey: column.pk === 1
			});

			if (column.pk === 1)
				this.#primaryKey = column.name;

		}

	}

	/** queryOne
	 *
	 * @param query
	 * @param params
	 * @returns {Object}
	 */
	execute(query, params = {}) {

		return this.#executor.run(query, params);

	}

	/** queryOne
	 *
	 * @param query
	 * @param params
	 * @returns {Object}
	 */
	queryOne(query, params = {}) {

		return this.#executor.one(query, params);

	}

	/** queryMany
	 *
	 * @param query
	 * @param params
	 * @returns {Array}
	 */
	queryMany(query, params = {}) {

		return this.#executor.all(query, params);

	}

	/** findOne
	 *
	 * @param query
	 * @param params
	 * @param TypeClass 		default: ENTITY_CLASS
	 * @returns {*}
	 */
	findOne(query, params = {}, TypeClass = this.ENTITY_CLASS) {

		const data = this.queryOne(query, params);

		if (!TypeClass) return data;

		if (data)
			return new TypeClass(data);

		return null;

	}

	/** findMany
	 *
	 * @param query
	 * @param params
	 * @param TypeClass 		default: ENTITY_CLASS
	 * @returns {*[]}
	 */
	findMany(query, params = {}, TypeClass = this.ENTITY_CLASS) {

		const data = this.queryMany(query, params);

		if (!TypeClass) return data;

		if (data.length > 0)
			return data.map(item => new TypeClass(item));

		return [];

	}

	/** findById
	 *
	 *	@param {*} id
	 *	@returns {*}
	 */
	findById(id) {

		const query = `select * from ${this.TABLE_NAME} where ${this.#primaryKey} = ?`;

		return this.findOne(query, [id]);

	}

	/** find
	 *
	 * @param {Criteria} criteria
	 * @returns {*}
	 */
	find(criteria = null) {

		if (!criteria) criteria = new Criteria();

		const {query, params} = QueryBuilder.fromCriteria(this.TABLE_NAME, criteria);

		return this.findMany(query, params);

	}

	/**
	 *
	 * @param {Object} entity
	 * @returns {Object}
	 */
	create(entity) {

		const data = this.serialize(entity);

		const keys = Object.keys(data);

		if (keys.length === 0) return 0;

		const clauses = keys.join(', ')
		const values = keys.map(k => ':' + k).join(', ');

		const query = `insert into ${this.TABLE_NAME} (${clauses}) values (${values})`;

		return this.#executor.run(query, data);

	}

	/** update
	 *
	 *  @param {Object} entity
	 *	@returns {Number}
	 */
	update(entity) {

		const data = this.serialize(entity);

		delete data[this.#primaryKey];

		const keys = Object.keys(data);

		if (keys.length === 0) return 0;

		const clauses = keys.map(function (e) {
			return e + ' = ?'
		});

		const query = `update ${this.TABLE_NAME} set ${clauses.join(', ')} where ${this.#primaryKey} = ?`;

		try {

			return this.#executor.run(query, [...Object.values(data), entity[this.#primaryKey]]);

		} catch (err) {

			return 0;

		}

	}

	/** deleteById
	 *
	 *	@param {*} id
	 *	@returns {Number}
	 */
	deleteById(id) {

		const query = `delete from ${this.TABLE_NAME} where ${this.#primaryKey} = ?`;

		try {

			return this.#executor.run(query, [id]);

		} catch (err) {

			return 0;

		}

	}

	/** serialize
	 *
	 * @param entity
	 * @returns {Object}
	 */
	serialize(entity) {

		const output = Object.create(null);

		for (const [key] of this.#schema) {

			let value = entity[key];

			if (value === undefined) continue;

			if (value instanceof Date)
				value = value.toISOString();

			output[key] = value;

		}

		return output;
	}

	/**
	 *
	 * @param {Function} handler
	 */
	transaction(handler) {

		const execute = this.#executor;

		try {

			execute.transaction();

			handler(execute);

			execute.commit();

		} catch (err) {

			execute.rollback();

			throw err;

		}

	}

}
