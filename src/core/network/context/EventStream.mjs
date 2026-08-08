/**
 *
 */
export class EventStream {

	constructor(response, headers = {}) {

		headers = Object.assign({
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		}, headers);

		for (const name in headers)
			response.setHeader(name, headers[name]);

		this.response = response;

	}

	send(data) {

		this.response.write(`data: ${JSON.stringify(data)}\n\n`);

	}

	close() {

		this.response.end();

	}

}