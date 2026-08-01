///
import {Builder} from '../core/Builder.mjs';
import {Authenticator} from '../core/security/Authenticator.mjs';

///
import {Authorize} from './security/Authorize.mjs';
import {JsonWebToken} from './security/JsonWebToken.mjs';
import {JWTAuthentication} from './security/authentications/JWTAuthentication.mjs';

///
import {AccountRepository} from '../modules/auth/infrastructure/repositories/AccountRepository.mjs';
import {PermissionRepository} from '../modules/auth/infrastructure/repositories/PermissionRepository.mjs';
import {RoleRepository} from '../modules/auth/infrastructure/repositories/RoleRepository.mjs';

/** AppBuilder
 *
 */
export class AppBuilder extends Builder {

	onBuildServices(app) {

		const accountRepository = app.get(AccountRepository);

		app.set(
			new Authorize(
				accountRepository,
				app.get(RoleRepository),
				app.get(PermissionRepository)
			)
		);

		///
		app.get(Authenticator)
			.registry(
				new JWTAuthentication(app.get(JsonWebToken), accountRepository)
			);

	}

}