import {Server} from '../../core/network/Server.mjs';
import {Router} from '../../core/network/Router.mjs';

/** MainRestServer
 *
 */
export class MainRestServer extends Server {

	#baseUrl = null;
	#host = null;
	#port = null;

	get BASE_URL() {
		return this.#baseUrl;
	}

	get HOST() {
		return this.#host;
	}

	get PORT() {
		return this.#port;
	}

	get ORIGINS() {
		return [this.#baseUrl];
	}

	/**
	 *
	 * @param {Context} context
	 * @param {AppSettings} settings
	 * @param {Logger} logger
	 * @param {Router} router
	 * @param {Authenticator} authenticator
	 */
	constructor(context, settings, logger, router, authenticator) {

		super();

		this.#baseUrl = settings.BASE_URL;
		this.#host = settings.SERVER_HOST;
		this.#port = settings.SERVER_PORT;

		this.context = context;
		this.logger = logger;
		this.router = router;
		this.authenticator = authenticator;

	}

	/**
	 *
	 */
	onStart() {

		this.logger.info(`MainRestServer.onStart: started on ${this.HOST}:${this.PORT}`);

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
			this.logger.debug(`MainRestServer.onRequest: ${request.getMethod()} '${request.getPath()}' reply 404`);
			response.replyError(404, 'Not Found', 'Page not found');
			return;
		}

		const scope = this.context.createScope();

		const authenticated = await this.authenticator.authenticate(scope, handler, request);

		if (!authenticated) {
			this.logger.debug(`MainRestServer.onRequest: ${request.getMethod()} ${request.getPath()} reply 401 (${handler.name})`);
			response.replyError(401, 'Unauthorized', 'Authentication required');
			return;
		}

		const instance = scope.get(handler);

		if (!instance.isAuthorized(request)) {
			this.logger.debug(`MainRestServer.onRequest: ${request.getMethod()} ${request.getPath()} reply 403 (${handler.name})`);
			response.replyError(403, 'Forbidden', 'Access denied');
			return;
		}

		this.logger.debug(`MainRestServer.onRequest: ${request.getMethod()} '${request.getPath()}' (${handler.name})`);

		await instance.resolve(request, response);

	}

	/**
	 *
	 * @param {RequestContext} request
	 * @param {ResponseContext} response
	 * @param {Error} error
	 */
	async onError(request, response, error) {

		this.logger.error(`MainRestServer.onError: ${request.getMethod()} ${request.getPath()} reply 500 message='${error.message}'`);

		response.replyError(500, "Internal Server Error", 'An internal error occurred');

	}

}
