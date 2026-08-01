import {Handler} from '../../../../core/http/Handler.mjs';

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

	constructor(loginAccountUseCase) {
		super();
		this.loginAccountUseCase = loginAccountUseCase;
	}

	resolve(request, response) {

		const [email, password] = request.getBasicAuthorization().split(/:/);
		const token = this.loginAccountUseCase.execute(email, password);

		if (token) {

			response.replyJson(200, token);

		} else {

			response.replyJson(403, {message: 'Account login failed'});

		}

	}

}
