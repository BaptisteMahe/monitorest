const socket = new WebSocket("wss://www.example.com/socketserver");
const cpuValues = [];

socket.onopen = event => {
	socket.onmessage = event => {

		cpuValue.innerText = event.data.cpuValue + "%"
		memoryValue.innerText = event.data.memoryValue + "MB"
		loadAverageValue.innerText = event.data.loadAverageValue
		responseTimeValue.innerText = event.data.responseTimeValue + "ms"
		requestsValue.innerText = event.data.requestsValue

		cpuValues.push(event.data.cpuValue);
		cpuChart.setOption({
			xAxis: {
				data: [new Date()]
			},
			series: [
				{
					name: "CPU Usage",
					data: cpuValues
				}
			]
		});
	}
}