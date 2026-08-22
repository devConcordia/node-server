/**
 *
 */
export class LoginAccountDTO {

	id;
	name;
	email;
	status;

	token;

	/**
	 *
	 * @param {Account} account
	 * @param {String} token
	 */
	constructor(account, token) {

		this.id = account.id;
		this.name = account.name;
		this.email = account.email;
		this.status = account.status;

		this.token = token;

	}

}