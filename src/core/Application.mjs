import {Container} from './composition/Container.mjs';
import {Resolver} from './composition/Resolver.mjs';
import {Context} from './composition/Context.mjs';
import {Builder} from './Builder.mjs';

/** Application
 *
 */
export class Application {

	#builders = [];

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
	 * @param {Builder} builder
	 */
	append(builder) {

		if (!(builder instanceof Builder))
			throw new Error(`${this.constructor.name}.append: '${builder.constructor.name}' is not a builder`);

		this.#builders.push(builder);

	}

	/**
	 *
	 * @return {Promise<Application>}
	 */
	async create() {

		for (const builder of this.#builders)
			await builder.create(this);

		if (this.onCreate instanceof Function)
			await this.onCreate();

		return this;

	}

	/**
	 *
	 * @return {Promise<Application>}
	 */
	async start() {

		for (const builder of this.#builders)
			await builder.start(this);

		if (this.onStart instanceof Function)
			await this.onStart();

		return this;

	}

}
