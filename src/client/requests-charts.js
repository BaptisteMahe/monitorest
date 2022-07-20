const barRequestsChart = echarts.init(document.getElementById('bar-requests-chart'));
const lineRequestsChart = echarts.init(document.getElementById('line-requests-chart'));

const requestsCharts = [ barRequestsChart, lineRequestsChart ];

window.onresize = () => requestsCharts.forEach(chart => chart.resize);

barRequestsChart.setOption(barOption);
lineRequestsChart.setOption(lineOption);
