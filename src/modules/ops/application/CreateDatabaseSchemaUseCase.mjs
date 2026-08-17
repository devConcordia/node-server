import fs from 'node:fs';
import path from 'node:path';

/**
 *
 */
export class CreateDatabaseSchemaUseCase {

	constructor(executor) {
		this.executor = executor;
	}

	execute(dir, filename) {

		if (!fs.existsSync(dir))
			throw new Error(`${this.constructor.name}.save: directory '${dir}' does not exist`);

		const filepath = path.join(dir, filename);

		const rows = this.executor.all(`
			SELECT sql 
			FROM sqlite_master 
			WHERE sql IS NOT NULL 
			  AND name NOT LIKE 'sqlite_%'
			  AND type IN ('table', 'index', 'trigger', 'view')
			ORDER BY rowid ASC;
		`);

		const schemaSql = rows
			.map(function (row) {
				const trimmed = row.sql.trim();
				return trimmed.endsWith(';') ? trimmed : `${trimmed};`;
			}).join('\n\n');

		fs.writeFileSync(filepath, schemaSql, 'utf-8');

	}

}