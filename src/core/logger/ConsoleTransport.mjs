import {Transport} from './Transport.mjs';

/** ConsoleTransport
 *
 */
export class ConsoleTransport extends Transport {

	write(level, message, timestamp) {

		console.log(`[${level}] [${timestamp}] ${message}`);

	}

}