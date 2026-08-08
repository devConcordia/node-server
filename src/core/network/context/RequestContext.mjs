import {Base64} from '../../encoding/Base64.mjs';

/** RequestContext
 *
 */
export class RequestContext {

	/**
	 *
	 * @param {Request} request
	 * @param {URL} url
	 * @param {string} body
	 */
	constructor(request, url, body) {

		this.request = request;

		this.url = url;
		this.body = body;
		this.params = Object.create(null);
		this.account = null;

	}

	/**
	 *
	 * @param {Function} handler
	 */
	onClose(handler) {

		let closed = false;

		function closeHandler() {
			if (!closed) {
				closed = true;
				handler();
			}
		}

		this.request.socket.once('close', closeHandler);
		this.request.socket.once('end', closeHandler);

		this.request.once('close', closeHandler);
		this.request.once('aborted', closeHandler);

	}

	/** setCurrentAccount
	 *
	 * @param {Account} account
	 */
	setCurrentAccount(account) {

		this.account = account;

	}

	/** getParams
	 *
	 * @returns {Account}
	 */
	getCurrentAccount() {

		return this.account;

	}


	/** getMethod
	 *
	 * @return {String}
	 */
	getMethod() {

		return this.request.method.toUpperCase();

	}

	/** getPath
	 *
	 * @return {String}
	 */
	getPath() {

		return this.url.pathname;

	}

	/** getBasicAuthorization
	 *
	 * @return {String|null}
	 */
	getBasicAuthorization() {

		const value = this.request?.headers?.authorization;

		if (typeof value === 'string') {

			const [type, data] = value.split(' ');

			if (type.toLowerCase() === 'basic')
				return Base64.decode(data);

		}

		return null;

	}

	/** getBearerToken
	 *
	 * @return {String|null}
	 */
	getBearerToken() {

		const value = this.request?.headers?.authorization;

		if (typeof value === 'string') {

			const [type, data] = value.split(' ');

			if (type.toLowerCase() === 'bearer')
				return Base64.decode(data);

		}

		return null;

	}

	/** getPayload
	 *
	 * @return {String|Object|null}
	 */
	getPayload() {

		const headers = this.request.headers;
		const output = this.body;

		if ('content-type' in headers) {
			if (headers['content-type'] === 'application/json') {
				try {

					return JSON.parse(output);

				} catch (err) {

					return null;

				}
			}
		}

		return output;

	}

	/** setParams
	 *
	 * @param {Object} params
	 */
	setParams(params) {

		this.params = params;

	}

	/** getParams
	 *
	 * @returns {Object}
	 */
	getParams() {

		return this.params;

	}

	/** getSearch
	 *
	 * @returns {Object}
	 */
	getSearch() {

		const output = Object.create(null);

		for (const [key, value] of this.url.searchParams) {
			if (output[key]) {
				output[key] = [].concat(output[key], value);
			} else {
				output[key] = value;
			}
		}

		return output;

	}

}