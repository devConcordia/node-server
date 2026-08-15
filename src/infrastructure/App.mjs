import {Application} from '../core/Application.mjs';
import {Authenticator} from '../core/security/Authenticator.mjs';
import {Router} from '../core/network/Router.mjs';
import {Logger} from '../core/logging/Logger.mjs';
import {ConsoleTransport} from '../core/logging/ConsoleTransport.mjs';
import {FileTransport} from '../core/logging/FileTransport.mjs';
///
import {AppSettings} from './AppSettings.mjs';
import {MainDatabaseExecutor} from './database/MainDatabaseExecutor.mjs';
import {MainRestServer} from './rest/MainRestServer.mjs';
import {PasswordHasher} from './security/PasswordHasher.mjs';
import {JsonWebToken} from './security/JsonWebToken.mjs';
import {Authorize} from './security/Authorize.mjs';
import {BasicAuthentication} from './security/authentications/BasicAuthentication.mjs';
import {JWTAuthentication} from './security/authentications/JWTAuthentication.mjs';
///
import {AccountRepository} from '../modules/auth/infrastructure/repositories/AccountRepository.mjs';

/** App
 *
 */
export class App extends Application {

	onCreate() {

		this.addSettings();
		this.addDatabases();
		this.addSecurity();
		this.addServer();

	}

	onStart() {

		const context = this.getContext();

		context.get(Router).orderBy(function (a, b) {
			return b.ROUTE.length - a.ROUTE.length
		});

		context.get(MainRestServer).start();

	}

	addSettings() {

		const container = this.getContainer();

		container.singleton(AppSettings, function () {
			return new AppSettings();
		});

		container.singleton(Logger, function (ctx) {

			const settings = ctx.get(AppSettings);

			///
			const consoleTransport = new ConsoleTransport();

			consoleTransport.enable(Logger.DEBUG);
			consoleTransport.enable(Logger.INFO);
			consoleTransport.enable(Logger.WARN);
			consoleTransport.enable(Logger.ERROR);

			///
			const fileTransport = new FileTransport(settings.LOG_PATH);

			fileTransport.enable(Logger.ERROR);

			///
			const logger = new Logger();

			logger.addTransport(consoleTransport);
			logger.addTransport(fileTransport);

			return logger;

		});

	}

	addDatabases() {

		const container = this.getContainer();

		container.singleton(MainDatabaseExecutor, function (ctx) {
			return new MainDatabaseExecutor(ctx.get(AppSettings));
		});

	}

	addSecurity() {

		const container = this.getContainer();

		container.singleton(PasswordHasher, function () {
			return new PasswordHasher();
		});

		container.singleton(JsonWebToken, function (ctx) {
			const settings = ctx.get(AppSettings);
			return new JsonWebToken(settings.JWT_SECRET, settings.JWT_ALGORITHM);
		});

		///
		container.singleton(Authorize, function (ctx) {
			return new Authorize(
				ctx.get(AccountRepository)
			);
		});

		///
		container.singleton(BasicAuthentication, function (ctx) {
			return new BasicAuthentication(
				ctx.get(PasswordHasher),
				ctx.get(AccountRepository)
			);
		});

		container.singleton(JWTAuthentication, function (ctx) {
			return new JWTAuthentication(
				ctx.get(JsonWebToken),
				ctx.get(AccountRepository)
			);
		});

	}

	addServer() {

		const container = this.getContainer();

		container.singleton(Router, function () {
			return new Router();
		});

		container.singleton(Authenticator, function () {
			return new Authenticator();
		});

		container.singleton(MainRestServer, function (ctx) {
			return new MainRestServer(
				ctx,
				ctx.get(AppSettings),
				ctx.get(Logger),
				ctx.get(Router),
				ctx.get(Authenticator)
			);
		});

	}

}
