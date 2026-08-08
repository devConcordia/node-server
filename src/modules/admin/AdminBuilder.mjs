import {Builder} from '../../core/Builder.mjs';
import {Router} from '../../core/network/Router.mjs';
import {MetricsHandler} from './infrastructure/handlers/MetricsHandler.mjs';

/**
 *
 */
export class AdminBuilder extends Builder {

	onCreate(app) {

		const container = app.getContainer();

		container.transient(MetricsHandler, function () {
			return new MetricsHandler()
		});

	}

	onStart(app) {

		const context = app.getContext();

		///
		const router = context.get(Router);

		router.registry(MetricsHandler);

	}
}