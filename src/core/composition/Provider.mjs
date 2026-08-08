/** Provider
 *
 */
export class Provider {

	static TRANSIENT = 'TRANSIENT';
	static SINGLETON = 'SINGLETON';
	static SCOPED = 'SCOPED';

	#handler;

	/**
	 *
	 *	@param {Function} handler
	 *	@param {String} lifetime 	 TRANSIENT | SINGLETON | SCOPED
	 */
	constructor(handler, lifetime) {

		this.#handler = handler;
		this.lifetime = lifetime;

	}

	/**
	 *
	 * @param context
	 */
	create(context) {

		return this.#handler(context);

	}

}
