/** Assert
 *
 */
export class Assert {

	/**
	 *
	 * @param {String} name
	 * @param {*} value
	 * @param {*} type
	 */
	static require(name, value, type) {

		switch (type) {
			case Number:
				if (typeof value !== 'number' || Number.isNaN(value))
					throw new TypeError(`${name} must be a number`);
				break;

			case String:
				if (typeof value !== 'string')
					throw new TypeError(`${name} must be a string`);
				break;

			case Boolean:
				if (typeof value !== 'boolean')
					throw new TypeError(`${name} must be a boolean`);
				break;

			default:
				if (!(value instanceof type))
					throw new TypeError(`${name} must be an instance of ${type.name}`);
				break;
		}

	}

	/**
	 *
	 * @param {String} name
	 * @param {*} value
	 */
	static ensureArray(name, value) {

		if (!Array.isArray(value))
			throw new TypeError(`${name} must be an array`);

	}

	/** ensureArrayOf
	 *
	 * @param {String} name
	 * @param {String} type
	 * @param {*} value
	 */
	static ensureArrayOf(name, value, type) {

		Assert.ensureArray(name, value);

		for (const e of value)
			Assert.require(`${name} element`, e, type);

	}

}
