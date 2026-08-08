import {Handler} from '../../../../core/http/Handler.mjs';
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
	 * @param {CreateAccountUseCase} createAccountUseCase
	 */
	constructor(createAccountUseCase) {
		super();
		this.createAccountUseCase = createAccountUseCase;
	}

	resolve(request, response) {

		const input = request.getPayload();

		if (this.createAccountUseCase.execute(input) < 1) {

			response.replyJson(400, {error: "can't create auth"});

		} else {

			response.replyNoContent();

		}

	}

}
