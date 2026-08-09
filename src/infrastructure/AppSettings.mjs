import {Settings} from '../core/Settings.mjs';

export class AppSettings extends Settings {

	DEBUG = undefined;

	SERVER_HOST = undefined;
	SERVER_PORT = undefined;
	BASE_URL = undefined;

	JWT_SECRET = undefined;
	JWT_ALGORITHM = undefined;

	DB_MAIN_PATH = undefined;

	LOG_PATH = undefined;

	constructor() {
		super();
		this.load();
	}

}