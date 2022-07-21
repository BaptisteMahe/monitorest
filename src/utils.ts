import { cpuUsage } from "os-utils";

export function computeRequestLoad(requests: any[]) {
	if (requests.length === 0) return 0;
	const totalTime = requests[requests.length -1].date - requests[0].date;
	return totalTime / requests.length;
}

export function getCpu(): Promise<number> {
	return new Promise<number>((resolve) => {
		cpuUsage(function (cpu) { resolve(cpu) });
	});
}

export function getDurationInMilliseconds(start: [ number, number ]): number {
	const diff = process.hrtime(start);
	return (diff[0] * 1e9 + diff[1]) / 1e6;
}
