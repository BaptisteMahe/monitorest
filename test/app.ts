import { monitorest } from "../src/monitorest";

import express from "express";

const app = monitorest(express(), 8080);
const port = 3000

app.get('/', (req: any, res: any) => {
	res.send('Hello World!');
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})