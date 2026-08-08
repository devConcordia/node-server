import {Provider} from './Provider.mjs';

/** Context
 *
 */
export class Context {

	#instances = new Map();

	#resolver = null;
	#root = null;

	#stack = new Set(); // resolving

	get stack() {
		return this.#stack;
	}

	/**
	 *
	 * @param {Resolver} resolver
	 * @param {Context} root
	 */
	constructor(resolver, root = null) {
		this.#resolver = resolver;
		this.#root = root;
	}

	/**
	 *
	 * @return {Context}
	 */
	createScope() {

		return new Context(this.#resolver, this.#root ?? this);

	}

	/**
	 *
	 * @param type
	 */
	has(type) {

		return this.#instances.has(type)

	}

	/**
	 *
	 * @param type
	 */
	get(type) {

		if (this.has(type))
			return this.#instances.get(type);

		if (this.#root && this.#root.has(type))
			return this.#root.get(type);

		return this.#resolver.get(this, type);

	}

	/**
	 *
	 * @param instance
	 * @param lifetime
	 */
	set(instance, lifetime = Provider.TRANSIENT) {

		if (this.has(instance.constructor))
			throw new Error(`Context.set: '${instance.constructor.name}' is already instantiated in this scope.`);

		switch (lifetime) {
			case Provider.SCOPED:
				this.#instances.set(instance.constructor, instance);
				break;

			case Provider.SINGLETON:
				if (this.#root) {

					this.#root.set(instance, lifetime);

				} else {

					this.#instances.set(instance.constructor, instance);

				}
				break;
		}

	}

}