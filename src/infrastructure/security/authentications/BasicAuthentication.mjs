import {Authentication} from '../../../core/security/Authentication.mjs';
import {Account} from '../../../modules/auth/domain/Account.mjs';
import {Password} from '../Password.mjs';

/** BasicAuthentication
 *
 */
export class BasicAuthentication extends Authentication {

	/**
	 *
	 * @param {AccountRepository} accountRepository
	 */
	constructor(accountRepository) {
		super();
		this.accountRepository = accountRepository;
	}

	/** fromRequest
	 *
	 * @param {RequestContext} request
	 * @return {Boolean}
	 */
	fromRequest(request) {

		const [email, password] = request.getBasicAuthorization().split(/:/);

		const data = this.accountRepository.findOneByEmail(email);

		if (data) {

			const account = new Account(data);

			if (Password.verify(account.password_hash, password)) {

				request.setCurrentAccount(account);

				return true;

			}
		}

		return false;

	}

}

