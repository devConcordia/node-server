/** Application
 *
 */
export class Builder {

	/** buildRepositories
	 *
	 * @param {Application} app
	 */
	buildRepositories(app) {

		if (this.onBuildRepositories instanceof Function)
			this.onBuildRepositories(app);

	}

	/** buildServices
	 *
	 * @param {Application} app
	 */
	buildServices(app) {

		if (this.onBuildServices instanceof Function)
			this.onBuildServices(app);

	}

	/** buildHandlers
	 *
	 * @param {Application} app
	 */
	buildHandlers(app) {

		if (this.onBuildHandlers instanceof Function)
			this.onBuildHandlers(app);

	}

}