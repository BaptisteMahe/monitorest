import { cpuUsage } from "os-utils";
import { Socket } from "socket.io";

import { Config } from "./models";

export function getCpu(): Promise<number> {
	return new Promise<number>((resolve) => {
		cpuUsage(function (cpu) { resolve(cpu) });
	});
}

export function getDurationInMilliseconds(start: [ number, number ]): number {
	const diff = process.hrtime(start);
	return (diff[0] * 1e9 + diff[1]) / 1e6;
}

export function validateConfig(config: Config) {
	if (!config.auth)
		console.warn("Monitorest as no auth, the monitoring route may be unprotected.");
	if (config.auth && (!config.auth.username || !config.auth.password))
		throw new Error("Auth config require username and password.");
	if (config.socket && !Socket.prototype.isPrototypeOf(config.socket))
		throw new Error("Wrong soket passed.")
}
