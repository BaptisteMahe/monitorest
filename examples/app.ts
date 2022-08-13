import http from "http";
import { monitorest } from "../index";

import express from "express";

const app = monitorest(express());
const port = 3000;

app.get('/', (req: any, res: any) => {
	res.send('Hello World!');
});

app.get('/status/:status', (req: any, res: any) => {
	res.status(req.params.status).send(`Status: ${req.params.status}`);
});

const serverHttp: http.Server = http.createServer(app);
serverHttp.listen(port, () => {
	console.log("HTTP Server listening at port : " + port);
});
//
// app.listen(port, () => {
// 	console.log(`Example app listening on port ${port}`);
// });
