import {Password} from '../../../infrastructure/security/Password.mjs';
import {Account} from '../domain/Account.mjs';
import {Assert} from '../../../core/common/Assert.mjs';

/** CreateAccountUseCase
 *
 */
export class CreateAccountUseCase {

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

		input.password = Password.hash(input.password);
		input.created = new Date();

		const account = new Account(input);

		Assert.isNonNull('Account.id', account.id);

		return this.accountRepository.create(account);

	}

}


