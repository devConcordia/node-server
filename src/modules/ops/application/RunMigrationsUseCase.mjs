import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {Migration} from '../domain/Migration.mjs';

/**
 *
 */
export class RunMigrationsUseCase {

	/**
	 *
	 * @param {Console|Logger} logger
	 * @param {MigrationRepository} migrationRepository
	 */
	constructor(logger, migrationRepository) {
		this.logger = logger;
		this.migrationRepository = migrationRepository;
	}

	execute(dir) {

		const files = this.getSqlFiles(dir);

		for (const filename of files) {

			const content = this.getFileContent(dir, filename);

			const checksum = this.getChecksum(content);

			if (this.wasExecuted(filename, checksum)) continue;

			///
			this.migrationRepository.transaction(executor => {

				executor.execute(content);

				this.migrationRepository.create(new Migration({filename, checksum}));

			});

			this.logger.info(`RunMigrationsUseCase.execute: '${filename}' executed`);

		}

	}

	wasExecuted(filename, checksum) {

		const migration = this.migrationRepository.findByFileName(filename);

		if (migration) {

			if (migration.checksum !== checksum)
				throw new Error(`RunMigrationsUseCase.execute: migration '${filename}' has been modified.`);

			this.logger.info(`RunMigrationsUseCase.execute: '${filename}' skipped`);

			return true;

		}

		return false;

	}

	/**
	 *
	 * @param {string} content
	 * @return {*}
	 */
	getChecksum(content) {

		return crypto.createHash('sha256').update(content).digest('hex');

	}

	/**
	 *
	 * @param {string} dir
	 * @param {string} filename
	 * @return {*}
	 */
	getFileContent(dir, filename) {

		const filepath = path.join(dir, filename);

		if (!fs.existsSync(filepath))
			throw new Error(`MigrationFileReader.read: file '${filepath}' does not exist.`);

		return fs.readFileSync(filepath, 'utf8');

	}

	/**
	 *
	 * @param {string} dir
	 * @return {string[]}
	 */
	getSqlFiles(dir) {

		return fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();

	}

}
