/** Transport
 *
 */
export class Transport {

	#levels = new Set();

	/**
	 *
	 * @param {String} level
	 */
	enable(level) {
		this.#levels.add(level);
	}

	/**
	 *
	 * @param {String} level
	 */
	disable(level) {
		this.#levels.delete(level);
	}

	/**
	 *
	 * @param {String} level
	 * @return {Boolean}
	 */
	accepts(level) {

		return this.#levels.has(level);

	}

	/**
	 *
	 * @param {String} level
	 * @param {String} message
	 * @param {String} timestamp
	 */
	send(level, message, timestamp) {

		if (this.accepts(level))
			this.write(level, message, timestamp);

	}

	write(level, message, timestamp) {

		throw new Error('Not implemented');

	}
}