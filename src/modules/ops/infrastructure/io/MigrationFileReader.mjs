import fs from 'node:fs';
import path from 'node:path';

/**
 *
 */
export class MigrationFileReader {

	#directory;

	/**
	 *
	 * @param directory
	 */
	constructor(directory) {

		if (!fs.existsSync(directory))
			throw new Error(`MigrationFileReader: directory '${directory}' does not exist.`);

		this.#directory = directory;

	}

	/**
	 *
	 * @param {string} filename
	 * @return {*}
	 */
	read(filename) {

		const filepath = path.join(this.#directory, filename);

		if (!fs.existsSync(filepath))
			throw new Error(`MigrationFileReader.read: file '${filepath}' does not exist.`);

		return fs.readFileSync(filepath, 'utf8');

	}

	/**
	 *
	 * @return {string[]}
	 */
	list() {

		return fs.readdirSync(this.#directory).filter(f => f.endsWith('.sql')).sort();

	}
}