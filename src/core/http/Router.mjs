/** calculatePriority
 *
 * @param {String} path
 */
function calculatePriority(path) {

	let score = 0;

	const parts = path.split("/");

	for (const part of parts) {

		if (part === "*")
			score += 1;
		else if (part.startsWith(":"))
			score += 10;
		else
			score += 100;

	}

	return score;

}

/** Router
 *
 */
export class Router {

	#routes = Object.create(null);

	/** registry
	 *
	 * @param {Handler} handler
	 */
	registry(handler) {

		const method = handler.METHOD.toUpperCase();

		console.log('Router.registry:', method, handler.ROUTE);

		const parameters = [];

		const regexPath = handler.ROUTE
			.replace(/\*/g, "(.*)")
			.replace(/:([^/]+)/g, function (match, replace) {
				parameters.push(replace);
				return "([^/]+)";
			});

		if (!(method in this.#routes))
			this.#routes[method] = [];

		this.#routes[method].push({
			regex: new RegExp(`^${regexPath}$`),
			parameters,
			handler,
			priority: calculatePriority(handler.ROUTE)
		});

	}

	/** orderBy
	 *
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
	 * @returns {Handler|null}
	 */
	getHandler(request) {

		const method = request.getMethod();
		const pathname = request.getPath();

		const routes = this.#routes[method];

		for (const route of routes) {

			const match = pathname.match(route.regex);

			if (!match)
				continue;

			const params = Object.create(null);

			for (const index in route.parameters) {
				const name = route.parameters[index];
				params[name] = match[index + 1];
			}

			request.setParams(params);

			return route.handler;

		}

		return null;

	}

}
