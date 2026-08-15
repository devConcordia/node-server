import {Authentication} from '../../../core/security/Authentication.mjs';

/**
 *
 * @param {string} input
 * @return {string[]|null}
 */
function getCredentials(input) {

	const i = input.indexOf(':');

	if (i <= 0)
		return null;

	return [input.substring(0, i), input.substring(i + 1)];

}

/** BasicAuthentication
 *
 */
export class BasicAuthentication extends Authentication {

	/**
	 *
	 * @param {PasswordHasher} passwordHasher
	 * @param {AccountRepository} accountRepository
	 */
	constructor(passwordHasher, accountRepository) {
		super();
		this.passwordHasher = passwordHasher;
		this.accountRepository = accountRepository;
	}

	/** fromRequest
	 *
	 * Authenticate the request using HTTP Basic Authentication.
	 *
	 * @param {RequestContext} request
	 * @return {Promise<boolean>}
	 */
	async fromRequest(request) {

		const authorization = request.getBasicAuthorization();

		if (!authorization)
			return false;

		const credentials = getCredentials(authorization);

		if (!credentials)
			return false;

		const [email, password] = credentials;

		const account = this.accountRepository.findOneByEmail(email);

		if (!account)
			return false;

		const validated = await this.passwordHasher.verify(password, account.getPasswordHash());

		if (!validated)
			return false;

		request.setCurrentAccount(account);

		return true;

	}

}
