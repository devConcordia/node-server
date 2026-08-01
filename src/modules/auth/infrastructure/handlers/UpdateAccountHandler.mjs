import {Handler} from '../../../../core/http/Handler.mjs';

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
