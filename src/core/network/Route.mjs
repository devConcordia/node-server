/**
 *
 */
export class Route {

	#regex;
	#parameters;
	#handler;

	/**
	 *
	 * @param {Handler} handler
	 */
	constructor(handler) {

		const parameters = [];

		const regexPath = handler.ROUTE
			.replace(/\*/g, "(.*)")
			.replace(/:([^/]+)/g, function (match, replace) {
				parameters.push(replace);
				return "([^/]+)";
			});

		this.#regex = new RegExp(`^${regexPath}$`);
		this.#parameters = parameters;
		this.#handler = handler;

	}

	get handler() {
		return this.#handler;
	}

	match(pathname) {

		return pathname.match(this.#regex);

	}

	getParameters(match) {

		const output = Object.create(null);

		this.#parameters.forEach((name, index) => {
			output[name] = match[index + 1];
		});

		return output;

	}

}