function computeRequestLoad(requests) {
	if ([0, 1].includes(requests.length)) return 0;
	const totalTime = requests[requests.length -1].date - requests[0].date;
	return requests.length / totalTime;
}

function computeResponseTime(requests) {
	return requests.length ? requests.reduce(
		(reducer, req) => reducer + req.responseTime,
		0) / requests.length : 0
}
