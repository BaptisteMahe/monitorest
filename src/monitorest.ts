import * as path from "path";
import { Server } from "ws";
import express from "express";
import fs from "fs";
import Handlebars from "handlebars";

import Session from "./session";
import { Config } from "./models";

export function monitorest(app: express.Application, config: Config): express.Application {

	let sessions: Session[] = [];

	// Socket server setup
	const socketServer = new Server({ port: config.port });
	socketServer.on("connection", ws => {
		console.log("new client connected");
		sessions.push(new Session(ws));
	});

	// Request Middleware
	app.use((req, res, next) => {
		sessions = sessions.filter(session => session.alive);
		sessions.forEach(session => session.newRequest(req, res));
		next();
	});

	// Client's route
	const render = Handlebars.compile(fs.readFileSync(path.join(__dirname, '/client/index.html')).toString());
	const context = {
		styles: fs.readFileSync(path.join(__dirname, "/client/styles.css")),
		main: fs.readFileSync(path.join(__dirname, "/client/main.js")),
		utils: fs.readFileSync(path.join(__dirname, "/client/utils.js"))
	}
	app.get("/monitorest", (req, res, next) => {
		res.send(render(context));
	});

	return app;
}
