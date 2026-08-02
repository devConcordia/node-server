import {Repository} from '../../../../core/database/Repository.mjs';
import {Account} from '../../domain/Account.mjs';

/** AccountRepository
 *
 */
export class AccountRepository extends Repository {

	get TABLE_NAME() {
		return 'auth_accounts'
	}

	get ENTITY_CLASS() {
		return Account
	}

	/** findOneByEmail
	 *
	 * @param email
	 * @returns {Account}
	 */
	findOneByEmail(email) {

		return this.findOne('select * from ' + this.TABLE_NAME + ' where email = :email', {email});

	}

	/** hasPermission
	 *
	 * @param {string} accountEmail
	 * @param {string} permissionName
	 * @returns {Boolean}
	 */
	hasPermission(accountEmail, permissionName) {

		const query = 'select exists ( ' + //
			'  select 1 from acc_accounts a ' + //
			'    join acc_rel_account_roles ar on ar.account_id = a.id ' + //
			'    join acc_rel_role_permissions rp on rp.role_id = ar.role_id ' + //
			'    join acc_permissions p on p.id = rp.permission_id ' + //
			'  where a.email = :accountEmail ' + //
			'    and p.name = :permissionName ' + //
			') as has_permission';

		return this.queryOne(query, {accountEmail, permissionName})?.has_permission > 0;

	}

	/** assignRole
	 *
	 * Metodo para vincular uma role a esta conta
	 *
	 * @param {number} accountId
	 * @param {number} roleId
	 */
	assignRole(accountId, roleId) {

		const query = 'insert or ignore into acc_rel_account_roles (account_id, role_id) values (:accountId, :roleId)';

		return this.execute(query, {accountId, roleId});

	}

	/** removeRole
	 *
	 * Metodo para desvincular uma role desta conta
	 *
	 * @param {number} accountId
	 * @param {number} roleId
	 */
	removeRole(accountId, roleId) {

		const query = `delete from acc_rel_account_roles where account_id = :accountId and role_id = :roleId`;

		return this.execute(query, {accountId, roleId});

	}

}
