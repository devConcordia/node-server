/** Assert
 *
 */
export class Assert {

	static NUMBER = 'number';
	static STRING = 'string';
	static BOOLEAN = 'boolean';
	static OBJECT = 'object';

	/** isNull
	 *
	 * @param {String} name
	 * @param {*} value
	 */
	static isNull(name, value) {

		if (value === null)
			throw TypeError(`${name} is null`);

	}

	/** isNonNull
	 *
	 * @param {String} name
	 * @param {*} value
	 */
	static isNonNull(name, value) {

		if (value !== null)
			throw TypeError(`${name} is non null`);

	}

	/** isBoolean
	 *
	 * @param {String} name
	 * @param {*} value
	 */
	static isBoolean(name, value) {

		if (typeof value !== Assert.BOOLEAN)
			throw TypeError(`${name} is not Boolean`);

	}

	/** isNumber
	 *
	 * @param {String} name
	 * @param {*} value
	 */
	static isNumber(name, value) {

        if (typeof value !== Assert.NUMBER || Number.isNaN(value))
            throw new TypeError(`${name} must be a valid Number`);

	}

	/** isString
	 *
	 * @param {String} name
	 * @param {*} value
	 */
	static isString(name, value) {

		if (typeof value !== Assert.STRING)
			throw TypeError(`${name} must be a String`);

	}

	/** isDate
	 *
	 * @param {String} name
	 * @param value
	 */
	static isDate(name, value) {

        if (!(value instanceof Date) || Number.isNaN(value.getTime()))
            throw new TypeError(`${name} must be a valid Date`);

	}

	/** isObject
	 *
	 * @param {String} name
	 * @param {*} value
	 */
	static isObject(name, value) {

		if (typeof value !== Assert.OBJECT)
			throw TypeError(`${name} must be a Object`);

	}

	/** isArray
	 *
	 * @param {String} name
	 * @param {String} type
	 * @param {*} value
	 */
	static isArray(name, type, value) {

		if (!Array.isArray(value))
			throw TypeError(`${name} must be a Array`);

		for (const e of value)
			if (!(typeof e !== type))
				throw TypeError(`${name} must be a Array of ${type}`);

	}

}
