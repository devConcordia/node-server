/** Authorize
 *
 */
export class Authorize {

	/**
	 *
	 * @param {AccountRepository} accountRepository
	 * @param {RoleRepository} roleRepository
	 * @param {PermissionRepository} permissionRepository
	 */
	constructor(accountRepository, roleRepository, permissionRepository) {
		this.accountRepository = accountRepository;
		this.roleRepository = roleRepository;
		this.permissionRepository = permissionRepository;
	}

	/**
	 *
	 * @param account
	 * @param role
	 */
	isRole(account, role) {

		/// TODO: Authorize.isRole
		console.warn('Authorize.isRole: not implemented');
		return false;

	}

	/**
	 *
	 * @param account
	 * @param permission
	 */
	hasPermission(account, permission) {

		/// TODO: Authorize.hasPermission
		console.warn('Authorize.hasPermission: not implemented');
		return true;

	}

}

