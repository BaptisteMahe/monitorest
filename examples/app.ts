import http from "http";
import { monitorest } from "../index";

import express from "express";

const app = monitorest(express(), { auth: { username: "admin", password: "password" } });
const port = 3000;

// Root route.
app.get('/', (req: any, res: any) => {
	res.send('Hello World!');
});

// Route to send chosen status from server.
app.get('/status/:status', (req: any, res: any) => {
	res.status(req.params.status).send(`Status: ${req.params.status}`);
});

// Create HTTP server to serve app.

// const serverHttp: http.Server = http.createServer(app);
// serverHttp.listen(port, () => {
// 	console.log(`Example app listening on port http://localhost:${port}`);
// });

// Serve app directly with express's listen method.

app.listen(port, () => {
	console.log(`Example app listening on port http://localhost:${port}`);
});
