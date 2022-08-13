function computeRequestLoad(requests) {
	if ([0, 1].includes(requests.length)) return 0;
	const totalTime = requests[requests.length -1].date - requests[0].date;
	return Number((requests.length / totalTime).toFixed(2));
}

function computeResponseTime(requests) {
	return requests.length ? Number((requests.reduce(
		(reducer, req) => reducer + req.responseTime,
		0) / requests.length).toFixed(2)) : 0
}

function loadHistory(requests, search) {
	const container = document.querySelector("#history-container");
	container.innerHTML = "";
	for (let request of requests)
		if (isRequestMatching(request, search))
			container.innerHTML = getHistoryElement(request) + container.innerHTML;
}

function getHistoryElement(request) {
	return `
		<div class="history-element">
			<div class="row">${formatMillisec(request.date)} ${request.method} ${request.url}</div>
			<div class="row">
				<div class="res-code ${getStatusClass(request.status)}">${request.status}</div>
				<div class="res-time">${request.responseTime.toFixed(1)}ms</div>
			</div>
		</div>
	`;
}

function isRequestMatching(request, search) {
	if (!search?.length) return true;
	return `${formatMillisec(request.date)} ${request.method} ${request.url}`.includes(search)
		|| request.status.toString().includes(search)
		|| `${request.responseTime.toFixed(1)}ms`.includes(search);
}

function getStatusClass(status) {
	if (status.toString().startsWith("2")) return "success";
	if (status.toString().startsWith("3")) return "warn";
	return "error";
}

function formatMillisec(milliseconds) {
	const date = new Date(milliseconds);
	return `${formatNum(date.getHours())}:${formatNum(date.getMinutes())}:${formatNum(date.getSeconds())}`;
}

function formatNum(num) {
	return `${num < 10 ? "0" : ""}${num}`;
}
