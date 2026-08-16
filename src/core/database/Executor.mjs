/** Executor
 *
 */
export class Executor {

	constructor() {

		if (new.target === Executor)
			throw new TypeError('Executor is an abstract class');

	}

	all(sql, params = {}) {

		throw new Error(`${this.constructor.name}.all() not implemented`);

	}

	one(sql, params = {}) {

		throw new Error(`${this.constructor.name}.one() not implemented`);

	}

	run(sql, params = {}) {

		throw new Error(`${this.constructor.name}.run() not implemented`);

	}

	getTableInfo(callback) {

		throw new Error(`${this.constructor.name}.getTableInfo() not implemented`);

	}

	execute() {

		throw new Error(`${this.constructor.name}.execute() not implemented`);

	}

	transaction() {

		throw new Error(`${this.constructor.name}.transaction() not implemented`);

	}

	commit() {

		throw new Error(`${this.constructor.name}.commit() not implemented`);

	}

	rollback() {

		throw new Error(`${this.constructor.name}.rollback() not implemented`);

	}

}
