import process from 'node:process';

import {Handler} from '../../../../core/network/Handler.mjs';
import {JWTAuthentication} from '../../../../infrastructure/security/authentications/JWTAuthentication.mjs';

/**
 *
 */
export class MetricsHandler extends Handler {

	static get METHOD() {
		return 'GET';
	}

	static get ROUTE() {
		return '/api/admin/metrics';
	}

	static get AUTH() {
		return [JWTAuthentication];
	}

	constructor(authorize) {
		super();
		this.authorize = authorize;
	}

	isAuthorized(request) {

		const account = request.getCurrentAccount();

		if (account)
			return this.authorize.isRole(account, 'MASTER');

		return false;

	}

	async resolve(request, response) {

		const sse = response.createEventStream();

		///
		let previousCpu = process.cpuUsage();

		function sendMetrics() {

			const memory = process.memoryUsage();
			const cpu = process.cpuUsage(previousCpu);

			previousCpu = process.cpuUsage();

			const cpuMs = (cpu.user + cpu.system) / 1000;
			const cpuPercent = cpuMs / 10;

			const metrics = {
				timestamp: new Date().toISOString(),
				memory: {
					rss: `${(memory.rss / 1024 / 1024).toFixed(2)} MB`,
					heapTotal: `${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB`,
					heapUsed: `${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`,
					external: `${(memory.external / 1024 / 1024).toFixed(2)} MB`
				},
				cpu: {
					user: `${(cpu.user / 1000).toFixed(2)} ms`,
					system: `${(cpu.system / 1000).toFixed(2)} ms`,
					percent: `${cpuPercent.toFixed(2)}%`
				},
				uptime: `${process.uptime().toFixed(2)} s`
			};

			sse.send(metrics);

		}

		///
		sendMetrics();

		const interval = setInterval(sendMetrics, 1000);

		///
		request.onClose(function () {

			clearInterval(interval);

		});

	}

}