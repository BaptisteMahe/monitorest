import { loadavg, totalmem } from "os-utils";
import { WebSocket } from "ws";
import express from "express";

import { computeRequestLoad, getCpu, getDurationInMilliseconds } from "./utils";
import { Request } from "./models";

export default class Session {

	alive: boolean = true;
	thread?: NodeJS.Timer;

	requests: Request[] = [];

	constructor(client: WebSocket) {
		this.thread = setInterval(() => {
			// console.log(this.requests);
			this.sendMessage(client);
		}, 1000);

		client.on("close", () => {
			console.log("The client has connected");
			this.stop();
		});

		// handling client connection error
		client.onerror = () => {
			console.log("Some Error occurred")
			this.stop();
		}
	}

	async sendMessage(client: WebSocket) {
		client.send(JSON.stringify({
			cpuValue: (await getCpu()).toFixed(4),
			memoryValue: totalmem(),
			loadAverageValue: loadavg(1).toFixed(4),
			responseTimeValue: this.requests.length ? (this.requests.reduce(
				(reducer, req) => reducer + req.responseTime,
				0) / this.requests.length).toFixed(4) : undefined,
			requestsValue: (computeRequestLoad(this.requests) / 1000).toFixed(4)
		}));
	}

	newRequest(req: express.Request, res: express.Response) {
		const start = process.hrtime();

		res.on('close', () => {
			this.requests.push({
				date: new Date().getTime(),
				status: res.statusCode,
				responseTime: getDurationInMilliseconds(start)
			});
		});
	}

	stop() {
		clearInterval(this.thread);
		this.alive = false;
	}
}
