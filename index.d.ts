import express from "express";

import { Config } from "./src/models";

export function monitorest(app: express.Application, config?: Config): express.Application;
