import {Route} from './Route.mjs';

/** Router
 *
 */
export class Router {

	#routes = Object.create(null);

	/** enable
	 *
	 * @param {typeof Handler} handler
	 */
	enable(handler) {

		const method = handler.METHOD.toUpperCase();

		if (!(method in this.#routes))
			this.#routes[method] = [];

		this.#routes[method].push(new Route(handler));

	}

	/** orderBy
	 *
	 * @param {Function} sorter
	 */
	orderBy(sorter) {

		for (const method in this.#routes) {
			this.#routes[method].sort(function (a, b) {
				return sorter(a.handler, b.handler);
			});
		}

	}

	/** getHandler
	 *
	 * @param {RequestContext} request
	 * @returns {typeof Handler|null}
	 */
	getHandler(request) {

		const method = request.getMethod();
		const pathname = request.getPath();

		const routes = this.#routes[method];

		if (!routes)
			return null;

		for (const route of routes) {

			const match = route.match(pathname);

			if (!match)
				continue;

			const params = route.getParameters(match);

			request.setParams(params);

			return route.handler;

		}

		return null;

	}

}
