import {LoginAccountDTO} from './dto/LoginAccountDTO.mjs';

/** LoginAccountUseCase
 *
 */
export class LoginAccountUseCase {

	/**
	 *
	 * @param {JsonWebToken} jsonWebToken
	 */
	constructor(jsonWebToken) {
		this.jsonWebToken = jsonWebToken;
	}

	/** execute
	 *
	 * @param {Account} account
	 * @return {LoginAccountDTO}
	 */
	execute(account) {

		const token = this.jsonWebToken.create({sub: account.id}, 3600);

		return new LoginAccountDTO(account, token);

	}

}
