import {Server} from '../../core/http/Server.mjs';
import {Router} from '../../core/http/Router.mjs';
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
	 * @param {AppSettings} settings
	 * @param {Router} router
	 * @param {Authenticator} authenticator
	 */
	constructor(settings, router, authenticator) {
		super();
		this.router = router;
		this.authenticator = authenticator;

		this.#baseUrl = settings.BASE_URL;
		this.#host = settings.SERVER_HOST;
		this.#port = settings.SERVER_PORT;

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

		console.log('onRequest', `[${handler.constructor.name}]`, request.getPath())

		if (!this.authenticator.authenticate(handler, request)) {
			response.replyError(403, 'Forbidden', 'Authentication required');
			return;
		}

		await handler.resolve(request, response);

	}

	async onError(request, response, error) {

		const match = error.stack.match(/\((.*):(\d+):(\d+)\)/);

		if (match) {

			console.log('[' + match[1] + ':' + match[2] + ']: ' + error.message);

		} else {

			console.error('Internal Server Error: ', error);

		}

		response.replyError(500, "Internal Server Error", "Internal Server Error");

	}

}
