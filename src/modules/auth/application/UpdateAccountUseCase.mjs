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

		Assert.isNull('Account.id', account.id);

		this.accountRepository.update(account);

	}

}