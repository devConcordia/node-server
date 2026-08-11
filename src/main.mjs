import {App} from './infrastructure/App.mjs';
import {AuthModule} from './modules/auth/AuthModule.mjs';
import {AdminModule} from './modules/admin/AdminModule.mjs';

try {

	const app = new App();

	app.use(new AuthModule());
	app.use(new AdminModule());

	await app.create();
	await app.start();

} catch (error) {

	console.error(error);

}
