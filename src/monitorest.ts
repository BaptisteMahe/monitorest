import * as path from "path";
import { Server } from "ws";
import express from "express";

import Session from "./session";

export function monitorest(app: express.Application, port: number): express.Application {

	// Socket server setup
	const socketServer = new Server({ port });
	const sessions: Session[] = [];
	socketServer.on("connection", ws => {
		console.log("new client connected");
		sessions.push(new Session(ws));
	});

	// Request Middleware
	app.use((req, res, next) => {
		sessions.forEach(session => session.newRequest(req, res));
		next();
	});

	// Client's route
	app.use("/monitorest", express.static(path.join(__dirname, '/client')));

	return app;
}
