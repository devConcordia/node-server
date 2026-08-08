import {Buffer} from 'node:buffer';

const PADDING = '=';

/** Base64
 * 
 * @ref https://datatracker.ietf.org/doc/html/rfc4648
 * 
 */
export class Base64 {

	/** encode
	 * 
	 * @param {String} input
	 * @return {String}
	 */
	static encode(input) {

		return Buffer.from(input).toString('base64');

	}

	/** decode
	 * 
	 * @param {String} input
	 * @return {String}
	 */
	static decode(input) {

		return Buffer.from(input, 'base64').toString();

	}

	/** encodeURL
	 *
	 *	RFC 4648:
	 *		Replaces + by - (minus)
	 *		Replaces / by _ (underline)
	 *		Does not require a padding character Forbids line separators
	 *
	 *	@param {String} input
	 *	@return {String}
	 */
	static encodeURL(input) {

		//return Buffer.from(input).toString('base64').replace(/\+/gm, '-').replace(/\//gm, '_');
        return Buffer.from(input).toString('base64url');

	}

	/** decodeURL
	 *
	 *	RFC 4648:
	 *		Replaces + by - (minus)
	 *		Replaces / by _ (underline)
	 *		Does not require a padding character Forbids line separators
	 *
	 *	@param {String} input
	 *	@return {String}
	 */
	static decodeURL(input) {

		//return Buffer.from(input.replace(/-/gm, '+').replace(/_/gm, '/'), 'base64').toString();
        return Buffer.from(input, 'base64url').toString('utf8');

	}

	/** padding
	 *
	 * @param {String} input
	 * @returns {string}
	 */
	static padding(input) {

		return input + PADDING.repeat((4 - (input.length % 4)) % 4);

	}

}
