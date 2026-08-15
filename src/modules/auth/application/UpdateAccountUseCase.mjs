import {Assert} from '../../../core/assertion/Assert.mjs';

/** UpdateAccountUseCase
 *
 */
export class UpdateAccountUseCase {

	get PERMISSION() {
		return "account_create"
	}

	/**
	 *
	 * @param {AccountRepository} accountRepository
	 */
	constructor(accountRepository) {
		this.accountRepository = accountRepository;
	}

	/** execute
	 *
	 * @param {Object} input
	 */
	execute(input) {

		const account = new Account();
		account.assign(input);

		Assert.require('Account.id', account.id, Number);

		this.accountRepository.update(account);

	}

}