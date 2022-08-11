const socket = new WebSocket("ws://localhost:8080");

let requests = [];

const succeedRequestsNum = [];
const warnedRequestsNum = [];
const failedRequestsNum = [];

const messageDates = [];

const cpuValues = [];
const memoryValues = [];
const loadAverageValues = [];
const responseTimeValues = [];
const requestsValues = [];

const CHART_TIME_WIDTH = 50;

socket.onopen = _ => {
	socket.onmessage = event => {
		const payload = JSON.parse(event.data);
		// console.log(payload);

		requests = requests.concat(payload.requests);

		/* ------------------ CHARTS ------------------ */

		messageDates.push(new Date(payload.date).toISOString().slice(11,19));
		if (messageDates.length > CHART_TIME_WIDTH) messageDates.shift();

		cpuValues.push(payload.cpuValue);
		cpuValue.innerText = payload.cpuValue + "%";
		if (cpuValues.length > CHART_TIME_WIDTH) cpuValues.shift();
		cpuChart.setOption({
			xAxis: {
				data: messageDates
			},
			series: [
				{
					name: 'Cpu',
					type: 'line',
					showSymbol: false,
					areaStyle: { },
					data: cpuValues
				}
			]
		});

		memoryValues.push(payload.memoryValue);
		memoryValue.innerText = payload.memoryValue + "%";
		if (memoryValues.length > CHART_TIME_WIDTH) memoryValues.shift();
		memoryChart.setOption({
			xAxis: {
				data: messageDates
			},
			series: [
				{
					name: 'Memory usage',
					type: 'line',
					showSymbol: false,
					areaStyle: { },
					data: memoryValues
				}
			]
		});

		loadAverageValues.push(payload.loadAverageValue);
		loadAverageValue.innerText = payload.loadAverageValue;
		if (loadAverageValues.length > CHART_TIME_WIDTH) loadAverageValues.shift();
		loadAverageChart.setOption({
			xAxis: {
				data: messageDates
			},
			series: [
				{
					name: 'Load average',
					type: 'line',
					showSymbol: false,
					areaStyle: { },
					data: loadAverageValues
				}
			]
		});

		responseTimeValues.push(computeResponseTime(payload.requests));
		responseTimeValue.innerText = responseTimeValues[responseTimeValues.length - 1].toFixed(2) + "ms";
		if (responseTimeValues.length > CHART_TIME_WIDTH) responseTimeValues.shift();
		responseTimeChart.setOption({
			xAxis: {
				data: messageDates
			},
			series: [
				{
					name: 'Response time',
					type: 'line',
					showSymbol: false,
					areaStyle: { },
					data: responseTimeValues
				}
			]
		});

		requestsValues.push(computeRequestLoad(payload.requests) * 1000);
		requestsValue.innerText = requestsValues[responseTimeValues.length - 1].toFixed(2);
		if (requestsValues.length > CHART_TIME_WIDTH) requestsValues.shift();
		requestsChart.setOption({
			xAxis: {
				data: messageDates
			},
			series: [
				{
					name: 'Request number',
					type: 'line',
					showSymbol: false,
					areaStyle: { },
					data: requestsValues
				}
			]
		});

		/* ------------------ HISTORY ------------------ */

		payload.requests.forEach(addToHistory);

		/* ------------------ REQUESTS CHARTS ------------------ */

		barRequestsChart.setOption({
			series: [
				{
					name: 'main',
					data: [
						{
							value: requests.filter(request => request.status.toString().startsWith("2")).length,
							itemStyle: { color: 'green' }
						},
						{
							value: requests.filter(request => request.status.toString().startsWith("3")).length,
							itemStyle: { color: 'orange' }
						},
						{
							value: requests.filter(
								request => request.status.toString().startsWith("4") || request.status.toString().startsWith("5")
							).length,
							itemStyle: { color: 'red' }
						}
					]
				}
			]
		});

		succeedRequestsNum.push(payload.requests.filter(request => request.status.toString().startsWith("2")).length);
		if (succeedRequestsNum.length > CHART_TIME_WIDTH) succeedRequestsNum.shift()
		warnedRequestsNum.push(payload.requests.filter(request => request.status.toString().startsWith("3")).length);
		if (warnedRequestsNum.length > CHART_TIME_WIDTH) warnedRequestsNum.shift()
		failedRequestsNum.push(payload.requests.filter(
				request => request.status.toString().startsWith("4") || request.status.toString().startsWith("5")
			).length
		);
		if (failedRequestsNum.length > CHART_TIME_WIDTH) failedRequestsNum.shift()

		lineRequestsChart.setOption({
			xAxis: {
				data: messageDates
			},
			series: [
				{
					name: 'success',
					type: 'line',
					showSymbol: false,
					data: succeedRequestsNum
				},
				{
					name: 'warning',
					type: 'line',
					showSymbol: false,
					data: warnedRequestsNum
				},
				{
					name: 'error',
					type: 'line',
					showSymbol: false,
					data: failedRequestsNum
				},
			],
			color: ['green', 'orange', 'red']
		})
	}
}
