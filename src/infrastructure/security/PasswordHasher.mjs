import {Buffer} from 'node:buffer';
import {promisify} from 'node:util';
import {randomBytes, scrypt, timingSafeEqual} from 'node:crypto';

const scryptAsync = promisify(scrypt);

/** PasswordHasher
 *
 */
export class PasswordHasher {

	/** hash
	 *
	 * @param {String} password
	 */
	async hash(password) {

		const salt = randomBytes(16);

		const derivedKey = await scryptAsync(password, salt, 64);

		return Buffer.concat([salt, derivedKey]).toString('base64');

	}

	/** verify
	 *
	 * @param {String} password
	 * @param {String} hash
	 */
	async verify(password, hash) {

		const data = Buffer.from(hash, 'base64');

		const salt = data.slice(0, 16);
		const key = data.slice(16, data.length);

		const derivedKey = await scryptAsync(password, salt, 64);

		return timingSafeEqual(key, derivedKey);

	}

}
