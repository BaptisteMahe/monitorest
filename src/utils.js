module.exports = {
	computeRequestLoad: (requests) => {
		if (requests.length === 0) return 0;
		const totalTime = requests[requests.length -1].date - requests[0].date;
		return totalTime / requests.length;
	}
}