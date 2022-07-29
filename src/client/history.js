const container = document.querySelector("#history-container");

function addToHistory(request) {
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

function isRequestMatching(request, string) {
	return `${formatMillisec(request.date)} ${request.method} ${request.url}`.includes(string)
		|| request.status.toString().includes(string)
		|| `${request.responseTime.toFixed(1)}ms`.includes(string);
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
