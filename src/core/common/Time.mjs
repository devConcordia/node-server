/** padding
 *
 * @param {number} input
 */
function padding(input) {

	return String(input).padStart(2, '0')

}

/** Time
 *
 */
export class Time {

	/** getTimestamp
	 *
	 * Unix time stamp is time as a running total of seconds.
	 * This count starts at the Unix Epoch on January 1st, 1970 at UTC.
	 *
	 * @ref https://en.wikipedia.org/wiki/Timestamp
	 *
	 * @param date
	 * @return {Number}
	 */
	static getTimestamp(date = new Date()) {

		return Math.floor(date.getTime() / 1000);

	}

	/** getISO
	 *
	 * @return {Date} date
	 * @return {String}
	 */
	static getISO(date = new Date()) {

		return date.toISOString();

	}

	/** getDate
	 *
	 * @return {Date} date
	 * @return {String}
	 */
	static getDate(date = new Date()) {

		return date.getFullYear() + '-' + padding(date.getMonth() + 1) + '-' + padding(date.getDate())

	}

	/** getTime
	 *
	 * @return {Date} date
	 * @return {String}
	 */
	static getTime(date = new Date()) {

		return date.getHours() + '-' + padding(date.getMinutes()) + '-' + padding(date.getSeconds())

	}

}
