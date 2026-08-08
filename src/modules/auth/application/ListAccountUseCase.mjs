/** ListAccountUseCase
 *
 */
export class ListAccountUseCase {

	get PERMISSION() {
		return "account_find_all"
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
	 */
	execute() {

		return this.accountRepository.find()
			.map(function (e) {
				return {
					id: e.id,
					name: e.name,
					email: e.email
				}
			});

	}

}