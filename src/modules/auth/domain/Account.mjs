/** Account
 *
 */
export class Account {

	#id = undefined;
	#name = undefined;
	#email = undefined;
	#password_hash = undefined;
	#created_at = undefined;
	#updated_at = undefined;

	constructor(data = {}) {
		if ('id' in data) this.id = data.id;
		if ('name' in data) this.name = data.name;
		if ('email' in data) this.email = data.email;
		if ('password_hash' in data) this.password_hash = data.password_hash;
		if ('created_at' in data) this.created_at = new Date(data.created_at);
		if ('updated_at' in data) this.updated_at = new Date(data.updated_at);
	}

	get id() {
		return this.#id
	}

	set id(value) {

		if (typeof value !== 'number')
			throw new TypeError('Account.id: must be a number');

		this.#id = value

	}

	get name() {
		return this.#name
	}

	set name(value) {

		if (typeof value !== 'string')
			throw new TypeError('Account.name: must be a string');

		this.#name = value

	}

	get email() {
		return this.#email
	}

	set email(value) {

		if (typeof value !== 'string')
			throw new TypeError('Account.email: must be a string');

		this.#email = value

	}

	// get password_hash() {
	// 	return this.#password_hash
	// }

	set password_hash(value) {

		if (typeof value !== 'string')
			throw new TypeError('Account.password_hash: must be a string');

		this.#password_hash = value

	}

	get created_at() {
		return this.#created_at
	}

	set created_at(value) {

		if (typeof value === 'string')
			value = new Date(value);

		if (Number.isNaN(value.getTime()) || !(value instanceof Date))
			throw new TypeError('Account.created_at: must be a valid Date');

		this.#created_at = value

	}

	get updated_at() {
		return this.#updated_at
	}

	set updated_at(value) {

		if (typeof value === 'string')
			value = new Date(value);

		if (Number.isNaN(value.getTime()) || !(value instanceof Date))
			throw new TypeError('Account.updated_at: must be a valid Date');

		this.#updated_at = value

	}

	getPasswordHash() {

		return this.#password_hash

	}

	toString() {

		return `Account(${this.id})`

	}

}