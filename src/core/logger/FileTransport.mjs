import fs from 'node:fs';
import path from 'node:path';
///
import {Transport} from './Transport.mjs';
import {Time} from '../common/Time.mjs';

/** FileTransport
 *
 */
export class FileTransport extends Transport {

	#dir;

	constructor(dir) {

		super();

		this.#dir = dir;

	}

	write(level, message, timestamp) {

		const filename = `${level}-${Time.getDate()}.log`.toLowerCase();

		fs.appendFileSync(path.join(this.#dir, filename), `[${level}] [${timestamp}] ${message}\n`);

	}

}