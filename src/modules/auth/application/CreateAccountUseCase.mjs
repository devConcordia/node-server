import {Account} from '../domain/Account.mjs';

/** CreateAccountUseCase
 *
 */
export class CreateAccountUseCase {

	get PERMISSION() {
		return "account_create"
	}

	/**
	 *
	 * @param {PasswordHasher} passwordHasher
	 * @param {AccountRepository} accountRepository
	 */
	constructor(passwordHasher, accountRepository) {
		this.passwordHasher = passwordHasher;
		this.accountRepository = accountRepository;
	}

	/** execute
	 *
	 * @param {Object} input
	 */
	execute(input) {

		input.password = this.passwordHasher.hash(input.password);
		input.created = new Date();

		const account = new Account(input);

		return this.accountRepository.create(account);

	}

}


