/** Role
 *
 */
export class Role {

	#id = undefined;
	#name = undefined;
	#description = undefined;

	constructor(data) {
		if ('id' in data) this.id = data.id;
		if ('name' in data) this.name = data.name;
		if ('description' in data) this.description = data.description;
	}

	get id() {
		return this.#id
	}

	set id(value) {

		if (typeof value !== 'number')
			throw new TypeError('Role.id: must be a number');

		this.#id = value

	}

	get name() {
		return this.#name
	}

	set name(value) {

		if (typeof value !== 'string')
			throw new TypeError('Role.name: must be a string');

		this.#name = value

	}

	get description() {
		return this.#description
	}

	set description(value) {

		if (typeof value !== 'string')
			throw new TypeError('Role.description: must be a string');

		this.#description = value

	}

}
