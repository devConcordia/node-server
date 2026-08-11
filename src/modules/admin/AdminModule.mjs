import {Module} from '../../core/Module.mjs';
import {Router} from '../../core/network/Router.mjs';
import {MetricsHandler} from './infrastructure/handlers/MetricsHandler.mjs';

/**
 *
 */
export class AdminModule extends Module {

	onSetup(app) {

		const container = app.getContainer();

		container.transient(MetricsHandler, function () {
			return new MetricsHandler()
		});

	}

	onAfterSetup(app) {

		const context = app.getContext();

		const router = context.get(Router);

		router.enable(MetricsHandler);

	}
}