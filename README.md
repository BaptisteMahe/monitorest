# Monitorest

## A lightweight monitor for express apps using Apache ECharts and Socket.io.

Inspired by [express-status-monitor](https://www.npmjs.com/package/express-status-monitor)

![monitorest client](https://baptistemahe.github.io/static/images/monitorest.png)

## Installation

`npm install monitorest --save`

## Usage

To create a monitored express app:
```javascript
import { monitorest } from "monitorest";
import express from "express";
const app = monitorest(express());
```

A realtime monitoring board will be available at `/monitorest`

## Configurations

You can add configurations for the client:

```javascript
import { monitorest } from "monitorest";
import express from "express";
const app = monitorest(express(), {
	auth: {
            username: process.env.monitorUser,
            password: process.env.monitorPassword
    }
});
```
