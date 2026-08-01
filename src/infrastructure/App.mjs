///
import {Application} from '../core/Application.mjs';
import {Authenticator} from '../core/security/Authenticator.mjs';
import {Router} from '../core/http/Router.mjs';
import {Logger} from '../core/logger/Logger.mjs';
import {FileTransport} from '../core/logger/FileTransport.mjs';
import {ConsoleTransport} from '../core/logger/ConsoleTransport.mjs';
///
import {MainDatabaseExecutor} from './database/MainDatabaseExecutor.mjs';
import {MainRestServer} from './rest/MainRestServer.mjs';
import {JsonWebToken} from './security/JsonWebToken.mjs';
import {AppSettings} from './AppSettings.mjs';


/** App
 *
 */
export class App extends Application {

	onCreate() {

		this.initSettings();
		this.initLogger();
		this.initDatabase();
		this.initSecurity();
		this.initServer();

	}

	onStart() {

		this.get(Router).orderBy(function (a, b) {
			return b.ROUTE.length - a.ROUTE.length
		});

		this.get(MainRestServer).start();

	}

	///

	initSettings() {

		const settings = new AppSettings();

		settings.load();

		///
		this.set(settings);

	}

	initLogger() {

		const settings = this.get(AppSettings);

		///
		const logger = new Logger();

		///
		const consoleTransport = new ConsoleTransport();

		consoleTransport.enable(Logger.INFO);
		consoleTransport.enable(Logger.WARN);
		consoleTransport.enable(Logger.ERROR);

		logger.addTransport(consoleTransport);

		///
		const fileTransport = new FileTransport(settings.LOG_PATH);

		fileTransport.enable(Logger.ERROR);

		logger.addTransport(fileTransport);

		///
		this.set(logger);
	}

	initDatabase() {

		const settings = this.get(AppSettings);

		const mainDatabaseExecutor = new MainDatabaseExecutor(settings);

		///
		this.set(mainDatabaseExecutor);

	}

	initSecurity() {

		const settings = this.get(AppSettings);

		const jsonWebToken = new JsonWebToken(settings.JWT_SECRET, settings.JWT_ALGORITHM);

		this.set(jsonWebToken);

	}

	initServer() {

		const settings = this.get(AppSettings);

		const router = new Router();
		const authenticator = new Authenticator();
		const server = new MainRestServer(settings, router, authenticator);

		///
		this.set(authenticator);
		this.set(router);
		this.set(server);
	}

}