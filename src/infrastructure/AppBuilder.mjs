import {Logger} from '../core/logging/Logger.mjs';
import {ConsoleTransport} from '../core/logging/ConsoleTransport.mjs';
import {FileTransport} from '../core/logging/FileTransport.mjs';
import {Builder} from '../core/Builder.mjs';
import {Router} from '../core/network/Router.mjs';
import {Authenticator} from '../core/security/Authenticator.mjs';
import {AppSettings} from './AppSettings.mjs';
import {MainDatabaseExecutor} from './database/MainDatabaseExecutor.mjs';
import {JsonWebToken} from './security/JsonWebToken.mjs';
import {Authorize} from './security/Authorize.mjs';
import {BasicAuthentication} from './security/authentications/BasicAuthentication.mjs';
import {JWTAuthentication} from './security/authentications/JWTAuthentication.mjs';
import {MainRestServer} from './rest/MainRestServer.mjs';
import {AccountRepository} from '../modules/auth/infrastructure/repositories/AccountRepository.mjs';
import {RoleRepository} from '../modules/auth/infrastructure/repositories/RoleRepository.mjs';
import {PermissionRepository} from '../modules/auth/infrastructure/repositories/PermissionRepository.mjs';

/**
 *
 */
export class AppBuilder extends Builder {

	onCreate(app) {

		const container = app.getContainer();

		container.singleton(AppSettings, function () {
			return new AppSettings().load();
		});

		///
		container.singleton(Logger, function (ctx) {

			const settings = ctx.get(AppSettings);

			///
			const consoleTransport = new ConsoleTransport();

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

		})

		///
		container.singleton(MainDatabaseExecutor, function (ctx) {
			return new MainDatabaseExecutor(ctx.get(AppSettings));
		});

		///
		container.singleton(JsonWebToken, function (ctx) {
			const settings = ctx.get(AppSettings);
			return new JsonWebToken(settings.JWT_SECRET, settings.JWT_ALGORITHM);
		});

		///
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
				ctx.get(Router),
				ctx.get(Authenticator)
			);
		});

		///
		container.singleton(Authorize, function (ctx) {
			return new Authorize(
				ctx.get(AccountRepository),
				ctx.get(RoleRepository),
				ctx.get(PermissionRepository)
			);
		});

		///
		container.singleton(BasicAuthentication, function (ctx) {
			return new BasicAuthentication(
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

}