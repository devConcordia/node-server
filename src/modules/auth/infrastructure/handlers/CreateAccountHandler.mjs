import {Handler} from '../../../../core/network/Handler.mjs';
import {JWTAuthentication} from '../../../../infrastructure/security/authentications/JWTAuthentication.mjs';

/** CreateAccountHandler
 *
 */
export class CreateAccountHandler extends Handler {

	static get METHOD() {
		return 'POST';
	}

	static get ROUTE() {
		return '/api/accounts';
	}

	static get AUTH() {
		return [JWTAuthentication];
	}

	/**
	 *
	 * @param {Authorize} authorize
	 * @param {CreateAccountUseCase} createAccountUseCase
	 */
	constructor(authorize, createAccountUseCase) {
		super();
		this.authorize = authorize;
		this.createAccountUseCase = createAccountUseCase;
	}

	isAuthorized(request) {

		const account = request.getCurrentAccount();

		if (account)
			return this.authorize.hasPermission(account, this.createAccountUseCase.PERMISSION);

		return false;

	}

	async resolve(request, response) {

		const input = request.getPayload();

		if (this.createAccountUseCase.execute(input) < 1) {

			response.replyJson(400, {error: "can't create auth"});

		} else {

			response.replyNoContent();

		}

	}

}
