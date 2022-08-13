import { freememPercentage, loadavg } from "os-utils";
import { Socket } from "socket.io";
import express from "express";

import { getCpu, getDurationInMilliseconds } from "./utils";
import { Request } from "./models";

export default class Session {

	client: Socket;

	alive: boolean = true;
	authenticated = false;
	token: string;
	thread?: NodeJS.Timer;

	requests: Request[] = [];

	constructor(client: Socket, token: string) {
		this.client = client;
		this.token = token;
		this.thread = setInterval(() => {
			this.sendMessage(client);
		}, 1000);

		this.client.on("disconnect", () => this.stop());

		this.client.on("auth", auth => {
			if (auth === token) this.authenticated = true;
			else this.client.disconnect(true);
		});

		this.client.on("error", () => this.stop());
	}

	async sendMessage(client: Socket) {
		if (!this.authenticated) return;
		client.emit("update", {
			date: new Date().getTime(),
			cpuValue: Number(((await getCpu() * 100)).toFixed(2)),
			memoryValue: Number(((1 - freememPercentage()) * 100).toFixed(2)),
			loadAverageValue: Number(loadavg(1).toFixed(2)),
			requests: this.requests
		});
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
