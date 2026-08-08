import {Handler} from '../../../../core/http/Handler.mjs';
import {JWTAuthentication} from '../../../../infrastructure/security/authentications/JWTAuthentication.mjs';

/** ListAccountHandler
 *
 */
export class ListAccountHandler extends Handler {

	static get METHOD() {
		return 'GET';
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
	 * @param {ListAccountUseCase} listAccountUseCase
	 */
	constructor(authorize, listAccountUseCase) {
		super();
		this.authorize = authorize;
		this.listAccountUseCase = listAccountUseCase;
	}

	isAuthorized(request) {

		const account = request.getCurrentAccount();

		if (account)
			return this.authorize.hasPermission(account, this.listAccountUseCase.PERMISSION);

		return false;

	}

	/**
	 *
	 * @param {RequestContext} request
	 * @param {ResponseContext} response
	 */
	resolve(request, response) {

		const accounts = this.listAccountUseCase.execute();

		response.replyJson(200, accounts || []);

	}

}
