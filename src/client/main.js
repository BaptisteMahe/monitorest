'use strict';

const CHART_TIME_WIDTH = 50;

let charts;
let search;

const socket = io();

socket.on("connect", () => {
	let requests = [];

	const succeedRequestsNum = [];
	const warnedRequestsNum = [];
	const failedRequestsNum = [];

	const messageDates = [];

	const cpuChart = new GeneralChart('Cpu', 'cpu-chart', 'cpu-value', '%');
	const memoryChart = new GeneralChart('Memory usage', 'memory-chart', 'memory-value', '%');
	const loadAverageChart = new GeneralChart('Load average', 'load-average-chart', 'load-average-value');
	const responseTimeChart = new GeneralChart('Response time', 'response-time-chart', 'response-time-value', 'ms');
	const requestsChart = new GeneralChart('Request load', 'requests-chart', 'requests-value');

	const barRequestsChart = echarts.init(document.getElementById('bar-requests-chart'));
	const lineRequestsChart = echarts.init(document.getElementById('line-requests-chart'));

	charts = [cpuChart, memoryChart, loadAverageChart, responseTimeChart, requestsChart, barRequestsChart, lineRequestsChart];
	window.onresize = () => charts.forEach(chart => chart.resize());

	window.onkeyup = _ => {
		search = document.getElementById('search-input').value;
		loadHistory(requests, search);
	}

	socket.emit("auth", token);

	socket.on("update", payload => {
		requests = requests.concat(payload.requests);

		/* ------------------ CHARTS ------------------ */

		messageDates.push(new Date(payload.date).toISOString().slice(11, 19));
		if (messageDates.length > CHART_TIME_WIDTH) messageDates.shift();

		cpuChart.onData(payload.cpuValue, messageDates);
		memoryChart.onData(payload.memoryValue, messageDates);
		loadAverageChart.onData(payload.loadAverageValue, messageDates);
		responseTimeChart.onData(computeResponseTime(payload.requests), messageDates);
		requestsChart.onData(computeRequestLoad(payload.requests) * 1000, messageDates);

		/* ------------------ HISTORY ------------------ */

		loadHistory(requests, search);

		/* ------------------ REQUESTS CHARTS ------------------ */

		barRequestsChart.setOption({
			grid: {
				left: 25,
				top: 5,
				right: 16,
				bottom: 20
			},
			xAxis: {
				type: 'category',
				data: ['2**', '3**', '4**, 5**']
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					name: 'main',
					type: 'bar',
					data: [
						{
							value: requests.filter(request => request.status.toString().startsWith("2")).length,
							itemStyle: {color: 'green'}
						},
						{
							value: requests.filter(request => request.status.toString().startsWith("3")).length,
							itemStyle: {color: 'orange'}
						},
						{
							value: requests.filter(
								request => request.status.toString().startsWith("4") || request.status.toString().startsWith("5")
							).length,
							itemStyle: {color: 'red'}
						}
					]
				}
			]
		});

		succeedRequestsNum.push(payload.requests.filter(request => request.status.toString().startsWith("2")).length);
		if (succeedRequestsNum.length > CHART_TIME_WIDTH) succeedRequestsNum.shift();
		warnedRequestsNum.push(payload.requests.filter(request => request.status.toString().startsWith("3")).length);
		if (warnedRequestsNum.length > CHART_TIME_WIDTH) warnedRequestsNum.shift();
		failedRequestsNum.push(payload.requests.filter(
				request => request.status.toString().startsWith("4") || request.status.toString().startsWith("5")
			).length
		);
		if (failedRequestsNum.length > CHART_TIME_WIDTH) failedRequestsNum.shift();

		lineRequestsChart.setOption({
			grid: {
				left: 27,
				top: 5,
				right: 22,
				bottom: 20
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: messageDates,
				axisLabel: {
					interval: 11,
					showMinLabel: true,
					showMaxLabel: true,
					fontSize: 10
				}
			},
			yAxis: {
				type: 'value',
				boundaryGap: [0, '50%']
			},
			tooltip: {
				trigger: 'axis'
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
		});
	});
});

socket.on("disconnect", _ => {
	console.log("disconnect");
	charts?.forEach(chart => chart.dispose());
});

socket.on("error", err => {
	charts?.forEach(chart => chart.dispose());
	console.error('Socket encountered error: ', err.message, 'Closing socket');
});

class GeneralChart {
	name;
	chart;
	data = [];

	valueDisplay;
	suffix;

	constructor(name, chartElemId, valueDisplayElemId, suffix = "") {
		this.name = name;
		this.chart = echarts.init(document.getElementById(chartElemId));
		this.chart.setOption({
			grid: {
				left: 27,
				top: 5,
				right: 22,
				bottom: 20
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				axisLabel: {
					interval: 11,
					showMinLabel: true,
					showMaxLabel: true,
					fontSize: 10
				}
			},
			yAxis: {
				type: 'value',
				boundaryGap: [0, '50%']
			},
			tooltip: {
				trigger: 'axis',
				valueFormatter: value => value + suffix
			}
		});
		this.valueDisplay = document.getElementById(valueDisplayElemId);
		this.suffix = suffix;
	}

	onData(newData, dates) {
		this.data.push(newData)
		this.valueDisplay.innerText = newData.toFixed(2) + this.suffix;
		if (this.data.length > CHART_TIME_WIDTH) this.data.shift();
		this.chart.setOption({
			xAxis: { data: dates },
			series: [
				{
					name: this.name,
					type: 'line',
					showSymbol: false,
					areaStyle: { },
					data: this.data
				}
			]
		});
	}

	resize() {
		this.chart.resize();
	}

	dispose() {
		this.chart.dispose()
	}
}
