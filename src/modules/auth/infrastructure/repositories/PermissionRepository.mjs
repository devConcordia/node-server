import {Repository} from '../../../../core/database/Repository.mjs';

/** PermissionRepository
 *
 */
export class PermissionRepository extends Repository {

	get TABLE_NAME() {
		return 'auth_permissions'
	}

	/** findOneByName
	 *
	 * @param name
	 * @returns {Object}
	 */
	findOneByName(name) {

		return this.queryOne(`select * from ${this.TABLE_NAME} where name = :name`, {name});

	}

}
