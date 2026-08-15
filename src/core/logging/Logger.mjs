import {Time} from '../time/Time.mjs';

/** Logger
 *
 */
export class Logger {

	static DEBUG = 'DEBUG';
	static INFO = 'INFO';
	static WARN = 'WARN';
	static ERROR = 'ERROR';

	///
	#transports = [];

	addTransport(transport) {

		this.#transports.push(transport);

	}

	debug(message) {
		this.write(Logger.DEBUG, message);
	}

	info(message) {
		this.write(Logger.INFO, message);
	}

	warn(message) {
		this.write(Logger.WARN, message);
	}

	error(message) {
		this.write(Logger.ERROR, message);
	}

	write(level, message) {

		const timestamp = Time.getISO();

		for (const transport of this.#transports)
			transport.send(level, message, timestamp);

	}

}