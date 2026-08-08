/**
 *
 */
export class Resolver {

	#container = null;

	/**
	 *
	 * @param {Container} container
	 */
	constructor(container) {
		this.#container = container;
	}

	/**
	 *
	 * @param {Context} context
	 * @param {*} type
	 * @return {*}
	 */
	get(context, type) {

		if (context.stack.has(type))
			throw new Error(`Resolver.get: Circular dependency with '${type.name}'`);

		context.stack.add(type);

		try {

			const provider = this.#container.get(type);

			if (!provider)
				throw new Error(`Provider not found for type: ${type.name}`);

			const instance = provider.create(context);

			context.set(instance, provider.lifetime);

			return instance;

		} finally {

			context.stack.delete(type);

		}

	}

}