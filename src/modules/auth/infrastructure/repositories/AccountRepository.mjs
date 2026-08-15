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

	/** hasRole
	 *
	 * @param {number} accountId
	 * @param {string} roleName
	 * @returns {boolean}
	 */
	hasRole(accountId, roleName) {

		const query = 'select exists ( ' +
			'  select 1 from auth_accounts a ' +
			'    join auth_accounts_roles ar on ar.account_id = a.id ' +
			'    join auth_roles r on r.id = ar.role_id ' +
			'  where a.id = :accountId ' +
			'    and r.name = :roleName ' +
			') as has_role';

		const result = this.queryOne(query, {accountId, roleName});

		if (result)
			return result.has_role > 0;

		return false;

	}

	/** hasPermission
	 *
	 * @param {number} accountId
	 * @param {string} permissionName
	 * @returns {boolean}
	 */
	hasPermission(accountId, permissionName) {

		const query = 'select exists ( ' +
			'  select 1 from auth_accounts a ' +
			'    join auth_accounts_roles ar on ar.account_id = a.id ' +
			'    join auth_roles_permissions rp on rp.role_id = ar.role_id ' +
			'    join auth_permissions p on p.id = rp.permission_id ' +
			'  where a.id = :accountId ' +
			'    and p.name like :permissionName ' +
			') as has_permission';

		const result = this.queryOne(query, {accountId, permissionName});

		if (result)
			return result.has_permission > 0;

		return false;

	}

	/** assignRole
	 *
	 * Assign a role to account
	 *
	 * @param {number} accountId
	 * @param {number} roleId
	 */
	assignRole(accountId, roleId) {

		const query = 'insert or ignore into auth_accounts_roles (account_id, role_id) values (:accountId, :roleId)';

		return this.execute(query, {accountId, roleId});

	}

	/** unassignRole
	 *
	 * Unassign a role to account
	 *
	 * @param {number} accountId
	 * @param {number} roleId
	 */
	unassignRole(accountId, roleId) {

		const query = `delete from auth_accounts_roles where account_id = :accountId and role_id = :roleId`;

		return this.execute(query, {accountId, roleId});

	}

}
