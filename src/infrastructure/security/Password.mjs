import {Buffer} from 'node:buffer';
import {scryptSync, randomBytes, timingSafeEqual} from 'node:crypto';

/** Password
 *
 */
export class Password {

	/** hash
	 *
	 * @param {String} password
	 */
	static hash(password) {

		const salt = randomBytes(16);

		const derivedKey = scryptSync(password, salt, 64);

		return Buffer.concat([ salt, derivedKey ]).toString('base64');

	}

	/** verify
	 *
     * @param {String} hash
	 * @param {String} password
	 */
	static verify(hash, password) {

		const data = Buffer.from(hash, 'base64');

		const salt = data.slice(0, 16);
		const key = data.slice(16, data.length);

		const derivedKey = scryptSync(password, salt, 64);

        return timingSafeEqual(key, derivedKey);

	}

}
