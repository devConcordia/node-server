/** Application
 *
 */
export class Application {

	#builders = new Set();
	#container = new Map();

	/**
	 *
	 * @param {Builder} builder
	 */
	registry(builder) {

		this.#builders.add(builder);

	}

	set(instance) {

		if (this.#container.has(instance.constructor))
			throw new Error(`${this.constructor.name}.set: '${instance.constructor.name}' has been registered`);

		this.#container.set(instance.constructor, instance);

	}

	get(classObject) {

		if (!this.#container.has(classObject))
			throw new Error(`${this.constructor.name}.get: '${classObject.name}' not initialized`);

		return this.#container.get(classObject);

	}

	async create() {

		if (this.onCreate instanceof Function)
			await this.onCreate();

		return this;

	}

	async build() {

		for (let m of this.#builders)
			await m.buildRepositories(this);

		for (let m of this.#builders)
			await m.buildServices(this);

		for (let m of this.#builders)
			await m.buildHandlers(this);

		return this;

	}

	async start() {

		if (this.onStart instanceof Function)
			await this.onStart();

		return this;

	}

}
