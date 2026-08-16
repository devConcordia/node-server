import crypto from 'node:crypto';
import {Migration} from '../domain/Migration.mjs';

/**
 *
 */
export class RunMigrationsUseCase {

	/**
	 *
	 * @param logger
	 * @param {MigrationRepository} migrationRepository
	 * @param {MigrationFileReader} migrationFileReader
	 */
	constructor(logger, migrationRepository, migrationFileReader) {
		this.logger = logger;
		this.repository = migrationRepository;
		this.fileReader = migrationFileReader;
	}

	execute() {

		const repository = this.repository;

		const files = this.fileReader.list();

		for (const filename of files) {

			const content = this.fileReader.read(filename);

			const checksum = this.getChecksum(content);

			const migration = repository.findByFileName(filename);

			if (migration) {

				if (migration.checksum !== checksum)
					throw new Error(`RunMigrationsUseCase.execute: migration '${filename}' has been modified.`);

				this.logger.info(`RunMigrationsUseCase.execute: '${filename}' skipped`);

				continue;

			}

			///
			repository.transaction(function (executor) {

				executor.execute(content);

				repository.create(new Migration({filename, checksum}));

			});

			this.logger.info(`RunMigrationsUseCase.execute: '${filename}' executed`);

		}

	}

	getChecksum(content) {

		return crypto.createHash('sha256').update(content).digest('hex');

	}

}
