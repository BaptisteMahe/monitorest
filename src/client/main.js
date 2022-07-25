const socket = new WebSocket("ws://localhost:8080");

const requests = [];

const cpuValues = [];
const memoryValues = [];
const loadAverageValues = [];
const responseTimeValues = [];
const requestsValues = [];

socket.onopen = event => {
	socket.onmessage = event => {
		const payload = JSON.parse(event.data);

		requests.push(payload.requests);
		cpuValues.push(payload.cpuValue);
		memoryValues.push(payload.memoryValue);
		loadAverageValues.push(payload.loadAverageValue);
		responseTimeValues.push(computeResponseTime(payload.requests));
		requestsValues.push(computeRequestLoad(payload.requests) * 1000)

		cpuValue.innerText = payload.cpuValue + "%";
		memoryValue.innerText = payload.memoryValue + "MB";
		loadAverageValue.innerText = payload.loadAverageValue;
		responseTimeValue.innerText = responseTimeValues[responseTimeValues.length - 1].toFixed(4) + "ms";
		requestsValue.innerText = requestsValues[responseTimeValues.length - 1].toFixed(4);


	}
}
