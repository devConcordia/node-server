import {Builder} from '../../core/Builder.mjs';
import {Router} from '../../core/network/Router.mjs';
import {CreateAccountHandler} from './infrastructure/handlers/CreateAccountHandler.mjs';
import {ListAccountHandler} from './infrastructure/handlers/ListAccountHandler.mjs';
import {LoginAccountHandler} from './infrastructure/handlers/LoginAccountHandler.mjs';
import {AccountRepository} from './infrastructure/repositories/AccountRepository.mjs';
import {MainDatabaseExecutor} from '../../infrastructure/database/MainDatabaseExecutor.mjs';
import {RoleRepository} from './infrastructure/repositories/RoleRepository.mjs';
import {PermissionRepository} from './infrastructure/repositories/PermissionRepository.mjs';
import {CreateAccountUseCase} from './application/CreateAccountUseCase.mjs';
import {ListAccountUseCase} from './application/ListAccountUseCase.mjs';
import {LoginAccountUseCase} from './application/LoginAccountUseCase.mjs';
import {JsonWebToken} from '../../infrastructure/security/JsonWebToken.mjs';
import {Authorize} from '../../infrastructure/security/Authorize.mjs';

/**
 *
 */
export class AuthBuilder extends Builder {

	onCreate(app) {

		const container = app.getContainer();

		///
		container.scoped(AccountRepository, function (ctx) {
			return new AccountRepository(ctx.get(MainDatabaseExecutor))
		});

		container.scoped(RoleRepository, function (ctx) {
			return new RoleRepository(ctx.get(MainDatabaseExecutor))
		});

		container.scoped(PermissionRepository, function (ctx) {
			return new PermissionRepository(ctx.get(MainDatabaseExecutor))
		});

		///
		container.scoped(CreateAccountUseCase, function (ctx) {
			return new CreateAccountUseCase(ctx.get(AccountRepository))
		});

		container.scoped(ListAccountUseCase, function (ctx) {
			return new ListAccountUseCase(ctx.get(AccountRepository))
		});

		container.scoped(LoginAccountUseCase, function (ctx) {
			return new LoginAccountUseCase(ctx.get(JsonWebToken))
		});

		///
		container.transient(CreateAccountHandler, function (ctx) {
			return new CreateAccountHandler(ctx.get(CreateAccountUseCase))
		});

		container.transient(ListAccountHandler, function (ctx) {
			return new ListAccountHandler(
				ctx.get(Authorize),
				ctx.get(ListAccountUseCase)
			)
		});

		container.transient(LoginAccountHandler, function (ctx) {
			return new LoginAccountHandler(ctx.get(LoginAccountUseCase))
		});
	}

	onStart(app) {

		const context = app.getContext();

		///
		const router = context.get(Router);

		router.registry(CreateAccountHandler);
		router.registry(ListAccountHandler);
		router.registry(LoginAccountHandler);
	}

}