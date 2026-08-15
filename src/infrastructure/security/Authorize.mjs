/** Authorize
 *
 */
export class Authorize {

	/**
	 *
	 * @param {AccountRepository} accountRepository
	 */
	constructor(accountRepository) {
		this.accountRepository = accountRepository;
	}

	/**
	 *
	 * @param {Account} account
	 * @param {string} role
	 * @return {boolean}
	 */
	isRole(account, role) {

		return this.accountRepository.hasPermission(account.id, role);

	}

	/**
	 *
	 * @param {Account} account
	 * @param {string} permission
	 * @return {boolean}
	 */
	hasPermission(account, permission) {

		return this.accountRepository.hasPermission(account.id, permission);

	}

}

