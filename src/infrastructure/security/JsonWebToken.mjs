import {Buffer} from 'node:buffer';
import crypto from 'node:crypto';

/** decodeParts
 *
 *  @param {String} value      string encoded base64url
 */
function decodeParts(value) {

	try {

		const output = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));

		if (!output || typeof output !== 'object' || Array.isArray(output))
			return null;

		return output;

	} catch {

		return null;

	}

}

/** hmacSign
 *
 * @param {String} hash
 * @param {String} secret
 * @param {String} content
 * @returns {ArrayBuffer}
 */
function hmacSign(hash, secret, content) {

	return crypto.createHmac(hash, secret)
		.update(content)
		.digest();

}

/** JsonWebToken
 *
 * @ref https://www.jwt.io
 *
 */
export class JsonWebToken {

	/**
	 *
	 * @param {String} secret
	 * @param {String} algorithm
	 */
	constructor(secret, algorithm) {

		/// TODO: verify algorithms
		///if (algorithm)
		///    throw new Error('Unsupported algorithm');

		this.secret = secret;
		this.algorithm = algorithm;
		this.hashType = "sha" + algorithm.substring(2);

	}

	/**	verify
	 *
	 *	@param {string} token
	 *	@return {Boolean}
	 */
	verify(token) {

		if (typeof token !== "string") return false;

		const parts = token.split('.');

		if (parts.length !== 3)
			return null;

		const header = decodeParts(parts[0]);

		if (header?.alg !== this.algorithm)
			return null;

		if (this.verifySignature(parts[0] + '.' + parts[1], parts[2])) {

			const payload = decodeParts(parts[1]);

			if (this.validateClaims(payload))
				return payload;

		}

		return null;

	}

	/** verifySignature
	 *
	 * @param {String} content
	 * @param {String} signature
	 * @returns {Boolean}
	 */
	verifySignature(content, signature) {

		const buffer = Buffer.from(signature, 'base64url');

		switch (this.algorithm) {

			case 'HS256':
			case 'HS384':
			case 'HS512':
				const expected = hmacSign(this.hashType, this.secret, content);

				if (expected.length !== buffer.length)
					return false;

				return crypto.timingSafeEqual(expected, buffer);

			case 'RS256':
			case 'RS384':
			case 'RS512':
				return false;
		}

		return false;

	}

	/** validateClaims
	 *
	 * @param {Object} payload
	 * @returns {boolean}
	 */
	validateClaims(payload) {

		if (!payload) return false;

		const now = Math.floor(Date.now() / 1000);

		if (payload.exp && payload.exp < now)
			return false;

		if (payload.nbf && payload.nbf > now)
			return false;

		return true;

	}

	/**	create
	 *
	 *	@param {Object} data
	 *	@param {Number} expiresIn
	 *	@return {String}
	 */
	create(data, expiresIn = 3600) {

		const now = Math.floor(Date.now() / 1000);

		const header = JSON.stringify({alg: this.algorithm, typ: 'JWT'});
		const payload = JSON.stringify({
			...data,
			iat: now,
			exp: now + expiresIn
		});

		let token = [
			Buffer.from(header).toString('base64url'),
			Buffer.from(payload).toString('base64url')
		];

		const content = token.join('.');

		switch (this.algorithm) {

			case 'HS256':
			case 'HS384':
			case 'HS512':
				token.push(hmacSign(this.hashType, this.secret, content).toString('base64url'));
				break;

			case 'RS256':
			case 'RS384':
			case 'RS512':
				throw new Error('Unsupported signature type');

		}

		return token.join('.');

	}

}
