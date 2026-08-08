/**
 *
 */
export class Builder {

	/**
	 *
	 *@param {Application} application
	 */
	async create(application) {

		if (this.onCreate instanceof Function)
			await this.onCreate(application);

	}

	/**
	 *
	 * @param {Application} application
	 */
	async start(application) {

		if (this.onStart instanceof Function)
			await this.onStart(application);

	}

}