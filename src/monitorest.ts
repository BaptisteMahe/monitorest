import * as path from "path";
import express from "express";
import { Server } from "socket.io";
import fs from "fs";
import Handlebars from "handlebars";
import * as crypto from "crypto";

import Session from "./session";
import { Config } from "./models";

export function monitorest(app: express.Application, config?: Config): express.Application {

	let sessions: Session[] = [];
	let token = crypto.randomUUID();

	let socketServer: Server;
	if (config?.socket) socketServer = new Server((config.socket as any).server);

	// Request Middleware
	app.use((req, res, next) => {
		// Socket server setup
		if (socketServer === undefined) {
			socketServer = new Server((req.socket as any).server);

			socketServer.on("connection", socket => {
				console.log("new client connected");
				sessions.push(new Session(socket, token));
			});
		}

		sessions = sessions.filter(session => session.alive);
		sessions.forEach(session => session.newRequest(req, res));
		next();
	});

	// Client's route
	const render = Handlebars.compile(fs.readFileSync(path.join(__dirname, '/client/index.html')).toString());
	const context = {
		styles: fs.readFileSync(path.join(__dirname, "/client/styles.css")),
		main: fs.readFileSync(path.join(__dirname, "/client/main.js")),
		utils: fs.readFileSync(path.join(__dirname, "/client/utils.js")),
		token: `"${token}"`
	}
	app.get("/monitorest", (req, res, next) => {
		res.send(render(context));
	});

	return app;
}
