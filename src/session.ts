import { freememPercentage, loadavg, totalmem } from "os-utils";
import { WebSocket } from "ws";
import express from "express";

import { getCpu, getDurationInMilliseconds } from "./utils";
import { Request } from "./models";

export default class Session {

	alive: boolean = true;
	thread?: NodeJS.Timer;

	requests: Request[] = [];

	constructor(client: WebSocket) {
		this.thread = setInterval(() => {
			this.sendMessage(client);
		}, 1000);

		client.on("close", () => this.stop());

		client.onerror = () => this.stop();
	}

	async sendMessage(client: WebSocket) {
		client.send(JSON.stringify({
			cpuValue: ((await getCpu() * 100)).toFixed(2),
			memoryValue: Math.trunc((1 - freememPercentage()) * totalmem()),
			loadAverageValue: loadavg(1).toFixed(2),
			requests: this.requests
		}));
		this.requests = []
	}

	newRequest(req: express.Request, res: express.Response) {
		const start = process.hrtime();
		res.on('close', () => {
			this.requests.push({
				date: new Date().getTime(),
				method: req.method,
				url: req.url,
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
