import {Authentication} from './Authentication.mjs';

/** Authenticator
 *
 */
export class Authenticator {

	#authentications = new Map();

	/** registry
	 *
	 * @param {Authentication} authentication
	 */
	registry(authentication) {

		if (!(authentication instanceof Authentication))
			throw new Error(`Authenticator.registry: @param '${authentication}' is not an instance of Authentication`);

		this.#authentications.set(authentication.constructor, authentication);

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

		for (const authClass of allowedList) {

			if (!this.#authentications.has(authClass))
				throw new Error(`Authenticator.authenticate: '${authClass.name}' not registered`);

			const authenticator = this.#authentications.get(authClass);

			if (authenticator.fromRequest(requestContext))
				return true;

		}

		return false;

	}

}