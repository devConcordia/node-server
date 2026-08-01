import {Builder} from '../../core/Builder.mjs';
import {Router} from '../../core/http/Router.mjs';

import {MainDatabaseExecutor} from '../../infrastructure/database/MainDatabaseExecutor.mjs';
import {JsonWebToken} from '../../infrastructure/security/JsonWebToken.mjs';
import {Authorize} from '../../infrastructure/security/Authorize.mjs';

import {CreateAccountUseCase} from './application/CreateAccountUseCase.mjs';
import {LoginAccountUseCase} from './application/LoginAccountUseCase.mjs';
import {ListAccountUseCase} from './application/ListAccountUseCase.mjs';

import {AccountRepository} from './infrastructure/repositories/AccountRepository.mjs';
import {PermissionRepository} from './infrastructure/repositories/PermissionRepository.mjs';
import {RoleRepository} from './infrastructure/repositories/RoleRepository.mjs';

import {LoginAccountHandler} from './infrastructure/handlers/LoginAccountHandler.mjs';
import {ListAccountHandler} from './infrastructure/handlers/ListAccountHandler.mjs';
import {CreateAccountHandler} from './infrastructure/handlers/CreateAccountHandler.mjs';

/** AuthBuilder
 *
 */
export class AuthBuilder extends Builder {

	onBuildRepositories(app) {

		const mainDatabaseExecutor = app.get(MainDatabaseExecutor);

		app.set(new AccountRepository(mainDatabaseExecutor));
		app.set(new PermissionRepository(mainDatabaseExecutor));
		app.set(new RoleRepository(mainDatabaseExecutor));

	}

	onBuildServices(app) {

		const accountRepository = app.get(AccountRepository);

		app.set(new CreateAccountUseCase(accountRepository));
		app.set(new ListAccountUseCase(accountRepository));
		app.set(new LoginAccountUseCase(app.get(JsonWebToken), accountRepository));

	}

	onBuildHandlers(app) {

		const router = app.get(Router);

		router.registry(new CreateAccountHandler(app.get(CreateAccountUseCase)));
		router.registry(new ListAccountHandler(app.get(Authorize), app.get(ListAccountUseCase)));
		router.registry(new LoginAccountHandler(app.get(LoginAccountUseCase)));

	}

}