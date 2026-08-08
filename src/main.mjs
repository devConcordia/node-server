import {App} from './infrastructure/App.mjs';
import {AppBuilder} from './infrastructure/AppBuilder.mjs';
import {AuthBuilder} from './modules/auth/AuthBuilder.mjs';

try {

	const app = new App();

	app.append(new AppBuilder());
	app.append(new AuthBuilder());

	await app.create();
	await app.start();

} catch (error) {

	console.error(error);

}
