/** Authentication
 *
 */
export class Authentication {

	/** Authentication
	 *
	 */
	constructor() {

		if (new.target === Authentication)
			throw new TypeError('Authentication is an abstract class');

	}

	/** fromRequest
	 *
	 * @param {RequestContext} request
	 * @return {Promise<boolean>}
	 */
	async fromRequest(request) {

		throw new Error(`${this.constructor.name}.fromRequest: not implemented`);

	}

}
