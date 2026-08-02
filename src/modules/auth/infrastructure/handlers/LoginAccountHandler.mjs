import {Handler} from '../../../../core/http/Handler.mjs';
import {BasicAuthentication} from '../../../../infrastructure/security/authentications/BasicAuthentication.mjs';

/** LoginAccountHandler
 *
 */
export class LoginAccountHandler extends Handler {

	get METHOD() {
		return 'POST';
	}

	get ROUTE() {
		return '/api/accounts/login';
	}

	get AUTH() {
		return [BasicAuthentication];
	}

	constructor(loginAccountUseCase) {
		super();
		this.loginAccountUseCase = loginAccountUseCase;
	}

	resolve(request, response) {

		const account = request.getCurrentAccount();

		if (!account)
			return response.replyError(401, 'unauthorized', 'Account login failed');

		const data = this.loginAccountUseCase.execute(account);

		response.replyJson(200, data);

	}

}
