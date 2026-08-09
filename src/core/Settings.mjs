import process from 'node:process';
import {Parser} from './parsing/Parser.mjs';

/** Settings
 *
 */
export class Settings {

	/** load
	 *
	 *	Read .evn variables of properties with undefined values.
	 *
	 */
	load() {

		const keys = Object.keys(this);

		for (const key of keys) {

			if (this[key] !== undefined) continue;

			const value = process.env[key];

			if (value === undefined)
				throw new Error(`${this.constructor.name}.load: missing '${key}'`);

			this[key] = Parser.parse(value);

		}

		Object.freeze(this);

		return this;

	}

}
