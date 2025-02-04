import { spawn } from 'node:child_process';
import { GameServer } from './game-server';
import process from "node:process";
import { resources } from './resources';

const server = GameServer.create();

if(process.env["NEW_WINDOW"]) spawn("msedge",[`--app=${server.url}`, '--inprivate']);

setTimeout(()=>process.exit(0), 600_000);
await resources.load();
await server.start();