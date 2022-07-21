const socket = new WebSocket("ws://localhost:8080");
const cpuValues = [];

socket.onopen = event => {
	socket.onmessage = event => {
		const payload = JSON.parse(event.data);

		cpuValue.innerText = payload.cpuValue + "%"
		memoryValue.innerText = payload.memoryValue + "MB"
		loadAverageValue.innerText = payload.loadAverageValue
		responseTimeValue.innerText = payload.responseTimeValue + "ms"
		requestsValue.innerText = payload.requestsValue

		// cpuValues.push(event.data.cpuValue);
		// cpuChart.setOption({
		// 	xAxis: {
		// 		data: [new Date()]
		// 	},
		// 	series: [
		// 		{
		// 			name: "CPU Usage",
		// 			data: cpuValues
		// 		}
		// 	]
		// });
	}
}