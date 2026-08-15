import {Authentication} from './Authentication.mjs';

/** Authenticator
 *
 */
export class Authenticator {

	/** authenticate
	 *
	 * @param {Context} context
	 * @param {typeof Handler} handler
	 * @param {RequestContext} requestContext
	 * @return {Promise<boolean>}
	 */
	async authenticate(context, handler, requestContext) {

		const allowedList = handler.AUTH ?? [];

		if (allowedList.length === 0)
			return true;

		for (const type of allowedList) {

			const authenticator = context.get(type);

			if (!(authenticator instanceof Authentication))
				throw new Error(`Authenticator.authenticate: '${type.name}' not registered`);

			if (await authenticator.fromRequest(requestContext))
				return true;

		}

		return false;

	}

}