import {Module} from '../../core/Module.mjs';
import {Router} from '../../core/network/Router.mjs';
import {Authorize} from '../../infrastructure/security/Authorize.mjs';
import {MetricsHandler} from './infrastructure/handlers/MetricsHandler.mjs';

/**
 *
 */
export class AdminModule extends Module {

	onSetup(app) {

		const container = app.getContainer();

		container.transient(MetricsHandler, function (ctx) {
			return new MetricsHandler(ctx.get(Authorize))
		});

	}

	onAfterSetup(app) {

		const context = app.getContext();

		const router = context.get(Router);

		router.enable(MetricsHandler);

	}
}