/**
 *
 */
export class LoginAccountDTO {

	id = undefined;
	name = undefined;
	email = undefined;

	token = undefined;

	/**
	 *
	 * @param {Account} account
	 * @param {String} token
	 */
	constructor(account, token) {

		this.id = account.id;
		this.name = account.name;
		this.email = account.email;

		this.token = token;

	}

}