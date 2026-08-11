/**
 *
 */
export class Module {

	/**
	 *
	 *@param {Application} application
	 */
	async setup(application) {

		if (this.onBeforeSetup instanceof Function)
			await this.onBeforeSetup(application);

		if (this.onSetup instanceof Function)
			await this.onSetup(application);

		if (this.onAfterSetup instanceof Function)
			await this.onAfterSetup(application);

	}

	/**
	 *
	 * @param {Application} application
	 */
	async start(application) {

		if (this.onStart instanceof Function)
			await this.onStart(application);

	}

	/**
	 *
	 * @param {Application} application
	 */
	async stop(application) {

		if (this.onStop instanceof Function)
			await this.onStop(application);

	}

}