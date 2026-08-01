import http from 'node:http';
import https from 'node:https';
import {Buffer} from 'node:buffer';
import {RequestContext} from './context/RequestContext.mjs';
import {ResponseContext} from './context/ResponseContext.mjs';

export class Server {

	get BASE_URL() {
		throw new Error(this.constructor.name + '.BASE_URL is undefined');
	};

	get HOST() {
		throw new Error(this.constructor.name + '.HOST is undefined');
	};

	get PORT() {
		throw new Error(this.constructor.name + '.PORT is undefined');
	};

	get CERTIFICATE() {
		return null;
	}

	get PRIVATE_KEY() {
		return null;
	}

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
	 * @constructor
	 */
	get HEADERS() {
		return {
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', /// PATCH
			'Access-Control-Allow-Headers': 'Content-Type, HttpHeadAuthorization',
			'Access-Control-Max-Age': 86400
		};
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
	 * @param errorContext
	 */
	async onError(requestContext, responseContext, errorContext) {

		responseContext.replyError(500, "Internal Server Error", "Internal Server Error");

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

			for await (const chunk of request)
				chunks.push(chunk);

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

	}

}
