import {Container} from './composition/Container.mjs';
import {Resolver} from './composition/Resolver.mjs';
import {Context} from './composition/Context.mjs';
import {Module} from './Module.mjs';

/** Application
 *
 */
export class Application {

	#modules = [];

	#container = null;
	#resolver = null;
	#context = null;

	constructor() {

		this.#container = new Container();
		this.#resolver = new Resolver(this.#container);
		this.#context = new Context(this.#resolver);

	}

	/**
	 *
	 * @return {null}
	 */
	getContainer() {

		return this.#container;

	}

	/**
	 *
	 * @return {null}
	 */
	getContext() {

		return this.#context;

	}

	/**
	 *
	 * @param {Module} module
	 */
	use(module) {

		if (!(module instanceof Module))
			throw new Error(`${this.constructor.name}.append: '${module.constructor.name}' is not a builder`);

		this.#modules.push(module);

	}

	/**
	 *
	 * @return {Promise<Application>}
	 */
	async create() {

		if (this.onCreate instanceof Function)
			await this.onCreate();

		for (const module of this.#modules)
			await module.setup(this);

		return this;

	}

	/**
	 *
	 * @return {Promise<Application>}
	 */
	async start() {

		for (const module of this.#modules)
			await module.start(this);

		if (this.onStart instanceof Function)
			await this.onStart();

		return this;

	}

	/**
	 *
	 * @return {Promise<Application>}
	 */
	async stop() {

		if (this.onStop instanceof Function)
			await this.onStop();

		for (let i = this.#modules.length - 1; i >= 0; i--)
			await this.#modules[i].stop(this);

		return this;

	}

}
