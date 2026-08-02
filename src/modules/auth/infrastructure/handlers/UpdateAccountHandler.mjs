import {Handler} from '../../../../core/http/Handler.mjs';
import {JWTAuthentication} from '../../../../infrastructure/security/authentications/JWTAuthentication.mjs';

/** UpdateAccountHandler
 *
 */
export class UpdateAccountHandler extends Handler {

	get METHOD() {

		return 'PUT';
	}

	get ROUTE() {
		return '/api/accounts/:accountId';
	}

	get AUTH() {
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
