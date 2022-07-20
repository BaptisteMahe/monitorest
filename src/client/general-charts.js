const cpuChart = echarts.init(document.getElementById('cpu-chart'));
const memoryChart = echarts.init(document.getElementById('memory-chart'));
const loadAverageChart = echarts.init(document.getElementById('load-average-chart'));
const responseTimeChart = echarts.init(document.getElementById('response-time-chart'));
const requestsChart = echarts.init(document.getElementById('requests-chart'));

const generalCharts = [ cpuChart, memoryChart, loadAverageChart, responseTimeChart, requestsChart ];

window.onresize = () => generalCharts.forEach(chart => chart.resize);

generalCharts.forEach(chart => chart.setOption(lineOption));

const cpuValue = document.getElementById('cpu-value');
const memoryValue = document.getElementById('memory-value');
const loadAverageValue = document.getElementById('load-average-value');
const responseTimeValue = document.getElementById('response-time-value');
const requestsValue = document.getElementById('requests-value');