import process from 'node:process';

/** Settings
 *
 */
export class Settings {

	/** load
	 *
	 */
	load() {

		for (let key in this) {

			if (this[key] !== null) continue;

			const value = process.env[key];

			if (value === undefined)
				throw new Error(`${this.constructor.name}.load: missing '${key}'`);

			this[key] = value;

		}

		return this;

	}

}
