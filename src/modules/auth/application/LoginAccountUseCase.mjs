import {Password} from '../../../infrastructure/security/Password.mjs';

/** LoginAccountUseCase
 *
 */
export class LoginAccountUseCase {

	/**
	 *
	 * @param {JsonWebToken} jsonWebToken
	 * @param {AccountRepository} accountRepository
	 */
	constructor(jsonWebToken, accountRepository) {
		this.accountRepository = accountRepository;
		this.jsonWebToken = jsonWebToken;
	}

	/** execute
	 *
	 * @param {String} email
	 * @param {String} password
	 * @return {String|null}
	 */
	execute(email, password) {

		const account = this.accountRepository.findOneByEmail(email);

		if (account && Password.verify(account.password_hash, password))
			return this.jsonWebToken.create({sub: account.id}, 3600);

		return null;

	}

}
