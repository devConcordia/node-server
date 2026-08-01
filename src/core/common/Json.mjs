/** Json
 *
 */
export class Json {

	/** decode
	 *
	 * @param {String} input
	 * @return {Object|null}
	 */
	static decode(input) {

		try {

			return JSON.parse(input);

		} catch {}

		return null;

	}

	/** encode
	 *
	 * @param {String} input
	 * @return {String|null}
	 */
	static encode(input) {

		try {

			return JSON.stringify(input);

		} catch {}

		return null;

	}

}
