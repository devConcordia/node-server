import {Authentication} from '../../../core/security/Authentication.mjs';

/** JWTAuthentication
 *
 */
export class JWTAuthentication extends Authentication {

	/**
	 *
	 * @param {JsonWebToken} jsonWebToken
	 * @param {AccountRepository} accountRepository
	 */
	constructor(jsonWebToken, accountRepository) {
		super();
		this.jsonWebToken = jsonWebToken;
		this.accountRepository = accountRepository;
	}

	/** fromRequest
	 *
	 * @param {RequestContext} request
	 * @return {Boolean}
	 */
	fromRequest(request) {

		const token = request.getBearerToken();

		const payload = this.jsonWebToken.verify(token);

		if (payload) {

			const account = this.accountRepository.findById(payload.sub);

			if (account) {

				request.setCurrentAccount(account);

				return true;

			}

		}

		return false;

	}

}

