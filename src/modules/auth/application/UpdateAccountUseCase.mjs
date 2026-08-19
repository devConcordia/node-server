import {Assert} from '../../../core/assertion/Assert.mjs';
import {Account} from '../domain/Account.mjs';

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

		const account = new Account(input);

		Assert.require('Account.id', account.id, Number);

		this.accountRepository.update(account);

	}

}