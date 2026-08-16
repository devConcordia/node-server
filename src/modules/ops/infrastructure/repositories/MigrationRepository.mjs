import {Migration} from '../../domain/Migration.mjs';
import {Repository} from '../../../../core/database/Repository.mjs';

/** MigrationRepository
 *
 */
export class MigrationRepository extends Repository {

	get TABLE_NAME() {
		return 'ops_migrations'
	}

	get ENTITY_CLASS() {
		return Migration
	}

	findByFileName(filename) {

		return this.findOne(`select * from ${this.TABLE_NAME} where filename = :filename`, {filename});

	}

}