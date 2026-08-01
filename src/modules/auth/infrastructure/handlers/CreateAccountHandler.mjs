import {Handler} from '../../../../core/http/Handler.mjs';

/** CreateAccountHandler
 *
 */
export class CreateAccountHandler extends Handler {

	get METHOD() {
		return 'POST';
	}

	get ROUTE() {
		return '/api/accounts';
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
