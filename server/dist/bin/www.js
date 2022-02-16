#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("../app"));
// Normalize a port into a number, string, or false.
// eslint-disable-next-line no-shadowed-variable
function normalizePort(val) {
    // eslint-disable-next-line no-shadowed-variable
    if (isNaN(parseInt(val, 10))) {
        // named pipe
        return val;
    }
    // eslint-disable-next-line no-shadowed-variable
    if (parseInt(val, 10) >= 0) {
        // port number
        return parseInt(val, 10);
    }
    // eslint-disable-next-line no-shadowed-variable
    return false;
}
// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '3000');
app_1.default.set('port', port);
// Create the HTTP server
const server = http_1.default.createServer(app_1.default);
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            // eslint-disable-line no-console
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            // eslint-disable-line no-console
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`); // eslint-disable-line no-console
}
// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
//# sourceMappingURL=www.js.map