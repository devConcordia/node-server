/**
 *
 */
export class Parser {

	/** parse
	 *
	 *	Check values and convert to
	 *	Obs: '00123' becomes 123 and '1.0' becomes 1
	 *
	 * @param {String} value
	 */
	static parse(value) {

		if (value === 'true')
			return true;

		if (value === 'false')
			return false;

		if (value.trim() !== '' && Number.isFinite(Number(value)))
			return Number(value);

		return value;

	}

}
