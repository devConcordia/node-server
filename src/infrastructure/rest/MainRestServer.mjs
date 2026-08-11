import {Server} from '../../core/network/Server.mjs';
import {Router} from '../../core/network/Router.mjs';
import {Authenticator} from '../../core/security/Authenticator.mjs';

/** MainRestServer
 *
 */
export class MainRestServer extends Server {

	#baseUrl = null;
	#host = null;
	#port = null;

	/**
	 *
	 * @returns {String}
	 */
	get BASE_URL() {
		return this.#baseUrl;
	}

	/**
	 *
	 * @returns {String}
	 */
	get HOST() {
		return this.#host;
	}

	/**
	 *
	 * @returns {String}
	 */
	get PORT() {
		return this.#port;
	}

	/**
	 *
	 * @return {Array}
	 */
	get ORIGINS() {
		return [this.#baseUrl];
	}

	/**
	 *
	 * @param {Context} context
	 * @param {AppSettings} settings
	 * @param {Router} router
	 * @param {Authenticator} authenticator
	 */
	constructor(context, settings, router, authenticator) {

		super();

		this.#baseUrl = settings.BASE_URL;
		this.#host = settings.SERVER_HOST;
		this.#port = settings.SERVER_PORT;

		this.context = context;
		this.router = router;
		this.authenticator = authenticator;

	}

	/**
	 *
	 * @param {RequestContext} request
	 * @param {ResponseContext} response
	 * @return Promise
	 */
	async onRequest(request, response) {

		const handler = this.router.getHandler(request);

		if (handler == null) {
			response.replyError(404, 'Not Found', 'Page not found');
			return;
		}

		const scope = this.context.createScope();

		if (!this.authenticator.authenticate(scope, handler, request)) {
			response.replyError(403, 'Forbidden', 'Authentication required');
			return;
		}

		const instance = scope.get(handler);

		await instance.resolve(request, response);

	}

	async onError(request, response, error) {

		const match = error.stack.match(/\((.*):(\d+):(\d+)\)/);

		if (match) {

			console.log('[' + match[1] + ':' + match[2] + ']: ' + error.message);

		} else {

			console.error('Internal Server Error: ', error);

		}

		response.replyError(500, "Internal Server Error", error.message);

	}

}
