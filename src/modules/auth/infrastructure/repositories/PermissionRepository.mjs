import {Repository} from '../../../../core/database/Repository.mjs';
import {Permission} from '../../domain/Permission.mjs';

/** PermissionRepository
 *
 */
export class PermissionRepository extends Repository {

	get TABLE_NAME() {
		return 'auth_permissions'
	}

	get ENTITY_CLASS() {
		return Permission
	}

	/** findOneByName
	 *
	 * @param name
	 * @returns {Permission}
	 */
	findOneByName(name) {

		return this.findOne(`select * from ${this.TABLE_NAME} where name = :name`, {name});

	}

}
