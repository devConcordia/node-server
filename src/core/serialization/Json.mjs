/** Json
 *
 */
export class Json {

	/** decode
	 *
	 * @param {String} input
	 * @param {*} fallback
	 * @return {*|null}
	 */
	static decode(input, fallback = null) {

		try {

			return JSON.parse(input);

		} catch {

			return fallback;

		}

	}

	/** encode
	 *
	 * @param {*} input
	 * @param {*} fallback
	 * @return {String|null}
	 */
	static encode(input, fallback = null) {

		try {

			return JSON.stringify(input);

		} catch {

			return fallback;

		}

	}

	/**
	 * @param {string} input
	 * @return {boolean}
	 */
	static isValid(input) {

		try {
			
			JSON.parse(input);
			return true;

		} catch {

			return false;

		}

	}

}