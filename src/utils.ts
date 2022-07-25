import { cpuUsage } from "os-utils";

export function getCpu(): Promise<number> {
	return new Promise<number>((resolve) => {
		cpuUsage(function (cpu) { resolve(cpu) });
	});
}

export function getDurationInMilliseconds(start: [ number, number ]): number {
	const diff = process.hrtime(start);
	return (diff[0] * 1e9 + diff[1]) / 1e6;
}
