import {App} from './infrastructure/App.mjs';
import {AppBuilder} from './infrastructure/AppBuilder.mjs';
import {AuthBuilder} from './modules/auth/AuthBuilder.mjs';

/**
 *
 * @returns {Promise<void>}
 */
async function main() {

	const app = new App();

	await app.create();

	///
	app.registry(new AppBuilder());

	///
	app.registry(new AuthBuilder());

	///
	await app.build();

	///
	await app.start();

}

main().catch(console.error);
