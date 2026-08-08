import {Provider} from './Provider.mjs';

/** Container
 *
 */
export class Container {

	#registries = new Map();

	/**
	 *
	 * @param {*} type
	 * @return {Provider}
	 */
	get(type) {

		if (!this.#registries.has(type))
			throw new Error(`Container.getFactory: '${type.name}' not registered`);

		return this.#registries.get(type);

	}

	/**
	 *
	 * @param {*} type
	 * @param {Function} method
	 * @return {*}
	 */
	transient(type, method) {

		this.#registries.set(type, new Provider(method, Provider.TRANSIENT));

	}

	/**
	 *
	 * @param {*} type
	 * @param {Function} method
	 * @return {*}
	 */
	singleton(type, method) {

		this.#registries.set(type, new Provider(method, Provider.SINGLETON));

	}

	/**
	 *
	 * @param {*} type
	 * @param {Function} method
	 * @return {*}
	 */
	scoped(type, method) {

		this.#registries.set(type, new Provider(method, Provider.SCOPED));

	}

}