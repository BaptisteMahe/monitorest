import { monitorest } from "../index";

import express from "express";

const app = monitorest(express(), { port: 8080 });
const port = 3000;

app.get('/', (req: any, res: any) => {
	res.send('Hello World!');
});

app.get('/status/:status', (req: any, res: any) => {
	res.status(req.params.status).send(`Status: ${req.params.status}`);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
