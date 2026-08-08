/** Handler
 *
 */
export class Handler {

	static get METHOD() {

		throw new Error(`${this.constructor.name}.METHOD not defined`);

	}

	static get ROUTE() {

		throw new Error(`${this.constructor.name}.ROUTE not defined`);

	}

	/// @type {Authentication}
	static get AUTH() {

		return [];

	}

	constructor() {

		if (new.target === Handler)
			throw new TypeError('Handler is an abstract class');

	}

	/** isAuthorized
	 *
	 * @param {RequestContext} request
	 * @return {Boolean}
	 */
	isAuthorized(request) {

		return true;

	}

	/** resolve
	 *
	 * @param {RequestContext} request
	 * @param {ResponseContext} response
	 * @return {Promise}
	 */
	async resolve(request, response) {

		throw new Error(`${this.constructor.name}.resolve: not implemented`);

	}

}