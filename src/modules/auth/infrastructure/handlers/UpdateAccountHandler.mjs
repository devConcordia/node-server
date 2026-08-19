import {Handler} from '../../../../core/network/Handler.mjs';
import {JWTAuthentication} from '../../../../infrastructure/security/authentications/JWTAuthentication.mjs';

/** UpdateAccountHandler
 *
 */
export class UpdateAccountHandler extends Handler {

	static get METHOD() {
		return 'PUT';
	}

	static get ROUTE() {
		return '/api/accounts/:accountId';
	}

	static get AUTH() {
		return [JWTAuthentication];
	}

	/**
	 *
	 * @param {Authorize} authorize
	 * @param {UpdateAccountUseCase} updateAccountUseCase
	 */
	constructor(authorize, updateAccountUseCase) {
		super();
		this.authorize = authorize;
		this.updateAccountUseCase = updateAccountUseCase;
	}

	isAuthorized(request) {

		const account = request.getCurrentAccount();

		if (account)
			return this.authorize.hasPermission(account, this.listAccountUseCase.PERMISSION);

		return false;

	}

	async resolve(request, response) {

		const input = request.getPayload();

		this.updateAccountUseCase.execute(input);

		response.replyNoContent();

	}

}
