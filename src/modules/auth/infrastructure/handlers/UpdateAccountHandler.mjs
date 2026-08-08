import {Handler} from '../../../../core/http/Handler.mjs';
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

	constructor(updateAccountUseCase) {
		super();
		this.updateAccountUseCase = updateAccountUseCase;
	}

	resolve(request, response) {

		const input = request.getPayload();

		this.updateAccountUseCase.execute(input);

		response.replyNoContent();

	}

}
