import {Authentication} from './Authentication.mjs';

/** Authenticator
 *
 */
export class Authenticator {

	#authentications = Object.create(null);

	/** registry
	 *
	 * @param {Authentication} authentication
	 */
	registry(authentication) {

		if (!(authentication instanceof Authentication))
			throw new Error(`Authenticator.registry: @param '${authentication}' is not an instance of Authentication`);

		this.#authentications[authentication.constructor.name] = authentication;

	}

	/** authenticate
	 *
	 * @param {Handler} controller
	 * @param {RequestContext} requestContext
	 * @return {Boolean}
	 */
	authenticate(controller, requestContext) {

		const allowedList = controller.AUTH ?? [];

		if (allowedList.length === 0)
			return true;

		for (const authName of allowedList) {

			const authenticator = this.#authentications[authName];

			if (!authenticator)
				throw new Error(`Authenticator.authenticate: '${authName}' not registered`);

			if (authenticator.fromRequest(requestContext))
				return true;

		}

		return false;

	}

}