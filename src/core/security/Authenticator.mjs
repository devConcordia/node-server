import {Authentication} from './Authentication.mjs';

/** Authenticator
 *
 */
export class Authenticator {

	/** authenticate
	 *
	 * @param {Context} context
	 * @param {Handler} handler
	 * @param {RequestContext} requestContext
	 * @return {Boolean}
	 */
	authenticate(context, handler, requestContext) {

		const allowedList = handler.AUTH ?? [];

		if (allowedList.length === 0)
			return true;

		for (const type of allowedList) {

			const authenticator = context.get(type);

			if (!(authenticator instanceof Authentication))
				throw new Error(`Authenticator.authenticate: '${type.name}' not registered`);

			if (authenticator.fromRequest(requestContext))
				return true;

		}

		return false;

	}

}