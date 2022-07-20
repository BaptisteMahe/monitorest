const WebSocketServer = require('ws');
const osUtils = require("os-utils");
const Session = require("./session");

const socketServer = new WebSocketServer.Server({ port: 8080 });
const sessions = [];

osUtils.cpuUsage(cpuUsage => sessions.forEach(session => session.setCpu(cpuUsage)));

module.exports = {
	monitorest: (app) => {
		// Socket server setup
		socketServer.on("connection", ws => {
			console.log("new client connected");
			sessions.push(new Session(ws));
		});

		// Request Middleware
		app.use((req, res, next) => {
			sessions.forEach(session => session.newRequest(req));
			next();
		});

		// Client's route
		app.use("/monitorest", express.static('./client'));
	}
}