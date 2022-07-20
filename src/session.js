const osUtils = require('os-utils');

const utils = require('./utils');

export default class Session {
	cpu;

	requests = [];

	constructor(client) {
		setInterval(() => {
			client.send({
				cpuValue: this.cpu,
				memoryValue: osUtils.freememPercentage(),
				loadAverageValue: osUtils.loadavg(1),
				responseTimeValue: this.requests[this.requests.length - 1].responseTime,
				requestsValue: utils.computeRequestLoad(this.requests) / 1000
			});
		}, 1000);

		client.on("close", () => {
			console.log("the client has connected");
		});
		// handling client connection error
		client.onerror = function () {
			console.log("Some Error occurred")
		}
	}

	setCpu(cpu) {
		this.cpu = cpu;
	}

	newRequest(request) {
		this.requests.push(request);
	}
}
