/** Migration
 *
 */
export class Migration {

	#id = undefined;
	#filename = undefined;
	#checksum = undefined;
	#executed_at = undefined;

	constructor(data = {}) {
		if ('id' in data) this.id = data.id;
		if ('filename' in data) this.filename = data.filename;
		if ('checksum' in data) this.checksum = data.checksum;
		if ('executed_at' in data) this.executed_at = new Date(data.executed_at);
	}

	get id() {
		return this.#id;
	}

	set id(value) {

		if (typeof value !== 'number')
			throw new TypeError('Migration.id: must be a number');

		this.#id = value;

	}

	get filename() {
		return this.#filename;
	}

	set filename(value) {

		if (typeof value !== 'string')
			throw new TypeError('Migration.filename: must be a string');

		this.#filename = value;

	}

	get checksum() {
		return this.#checksum;
	}

	set checksum(value) {

		if (typeof value !== 'string')
			throw new TypeError('Migration.checksum: must be a string');

		this.#checksum = value;

	}

	get executed_at() {
		return this.#executed_at;
	}

	set executed_at(value) {

		if (typeof value === 'string')
			value = new Date(value);

		if (Number.isNaN(value.getTime()) || !(value instanceof Date))
			throw new TypeError('Migration.executed_at: must be a valid Date');

		this.#executed_at = value;

	}

}