import http from 'node:http';
import https from 'node:https';
import {Buffer} from 'node:buffer';
import {RequestContext} from './context/RequestContext.mjs';
import {ResponseContext} from './context/ResponseContext.mjs';

export class Server {

	/**
	 * @returns {string}
	 */
	get BASE_URL() {
		throw new Error(this.constructor.name + '.BASE_URL is undefined');
	};

	/**
	 * @returns {string}
	 */
	get HOST() {
		throw new Error(this.constructor.name + '.HOST is undefined');
	};

	/**
	 * @returns {string}
	 */
	get PORT() {
		throw new Error(this.constructor.name + '.PORT is undefined');
	};

	/**
	 * @returns {string|null}
	 */
	get CERTIFICATE() {
		return null;
	}

	/**
	 * @returns {string|null}
	 */
	get PRIVATE_KEY() {
		return null;
	}

	/**
	 * @return {Array}
	 */
	get ORIGINS() {
		return [];
	}

	/**
	 *
	 * default:
	 * 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	 * 'Access-Control-Allow-Headers': 'Content-Type, HttpHeadAuthorization',
	 * 'Access-Control-Max-Age': 86400
	 *
	 * Cookies and Sessions need:
	 * 	'Access-Control-Allow-Credentials': true
	 *
	 * @return {Object}
	 */
	get HEADERS() {
		return {
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', /// PATCH
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			'Access-Control-Max-Age': 86400,

			'X-Content-Type-Options': 'nosniff',
			'X-Frame-Options': 'DENY',
			'Referrer-Policy': 'no-referrer',
			'X-XSS-Protection': '0'
		};
	}

	/**
	 *
	 * @return {number}
	 */
	get MAX_UPLOAD() {
		return 1e6 /// 1MB
	}

	/**
	 *
	 */
	onStart() {

	}

	/**
	 *
	 * @param requestContext
	 * @param responseContext
	 */
	async onRequest(requestContext, responseContext) {

		throw new Error(this.constructor.name + '.onRequest: not implemented.');

	}

	/**
	 *
	 * @param requestContext
	 * @param responseContext
	 * @param error
	 */
	async onError(requestContext, responseContext, error) {

		responseContext.replyError(500, "Internal Server Error", 'An internal error occurred');

	}

	/** start
	 *
	 */
	start() {

		const options = {};

		let instance = http;

		if (this.CERTIFICATE && this.PRIVATE_KEY) {

			instance = https;

			options.key = this.PRIVATE_KEY;
			options.cert = this.CERTIFICATE;
			options.requestCert = false;
			options.rejectUnauthorized = true;

		}

		const self = this;

		const server = instance.createServer(options, async function (request, response) {

			const responseContext = new ResponseContext(response);
			const origen = request.headers.origin;

			for (const name in self.HEADERS)
				response.setHeader(name, self.HEADERS[name]);

			if (origen) {

				response.setHeader('Access-Control-Allow-Origin', origen);

				if (!self.ORIGINS.includes(origen))
					return responseContext.replyError(403, 'Forbidden', 'CORS Origin Not Allowed');

			}

			/// preflight (CORS OPTIONS)
			if (request.method === 'OPTIONS')
				return responseContext.replyNoContent();

			///
			const chunks = [];

			let total = 0; // in bytes
			for await (const chunk of request) {
				total += chunk.length;
				if (total > self.MAX_UPLOAD) {
					responseContext.replyError(413, 'Payload Too Large', 'Request body exceeds limit');
					return;
				}
				chunks.push(chunk);
			}

			const payload = Buffer.concat(chunks).toString();
			const url = new URL(request.url, self.BASE_URL);

			const requestContext = new RequestContext(request, url, payload);

			try {

				await self.onRequest(requestContext, responseContext);

			} catch (error) {

				await self.onError(requestContext, responseContext, error);

			}

		});

		server.listen(this.PORT, this.HOST);

		this.onStart();

	}

}
