///
import {Application} from '../core/Application.mjs';
import {Router} from '../core/network/Router.mjs';
///
import {MainRestServer} from './rest/MainRestServer.mjs';


/** App
 *
 */
export class App extends Application {

	onStart() {

		const context = this.getContext();

		context.get(Router).orderBy(function (a, b) {
			return b.ROUTE.length - a.ROUTE.length
		});

		context.get(MainRestServer).start();

	}

}