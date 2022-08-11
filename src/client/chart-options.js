const lineOption = {
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
			interval: 10,
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
	}
};

const barOption = {
	grid: {
		left: 25,
		top: 5,
		right: 16,
		bottom: 20
	},
	xAxis: {
		type: 'category',
		data: ['2**', '3**', '5**']
	},
	yAxis: {
		type: 'value'
	},
	series: [
		{
			name: 'main',
			type: 'bar',
			showSymbol: false
		}
	]
};
