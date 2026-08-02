import {Repository} from '../../../../core/database/Repository.mjs';
import {Role} from '../../domain/Role.mjs';

/** RoleRepository
 *
 */
export class RoleRepository extends Repository {

	get TABLE_NAME() {
		return 'auth_roles'
	}

	get ENTITY_CLASS() {
		return Role
	}

	/** findOneByName
	 *
	 * @param name
	 * @returns {Object}
	 */
	findOneByName(name) {

		return this.findOne('select * from ' + this.TABLE_NAME + ' where name = :name', {name});

	}

	/** assignRole
	 *
	 * Metodo para vincular uma role a esta conta
	 *
	 * @param {number} roleId
	 * @param {number} permissionId
	 */
	assignPermission(roleId, permissionId) {

		const query = 'insert or ignore into acc_rel_role_permissions (role_id, permission_id) values (:roleId, :permissionId)';

		return this.execute(query, {roleId, permissionId});

	}

	/** removeRole
	 *
	 * Metodo para desvincular uma role desta conta
	 *
	 * @param {number} roleId
	 * @param {number} permissionId
	 */
	removePermission(roleId, permissionId) {

		const query = `delete from acc_rel_role_permissions where account_id = :accountId and role_id = :roleId`;

		return this.execute(query, {roleId, permissionId});

	}

}
