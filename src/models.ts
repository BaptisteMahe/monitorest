import { Socket } from "socket.io";

export type Request = {
	date: number;
	method: string;
	url: string;
	status: number;
	responseTime: number;
};

export type Config = {
	port: number;
	socket: Socket;
};
