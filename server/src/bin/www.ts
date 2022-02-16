#!/usr/bin/env node
import http from "http";
import app from "../app";

// Normalize a port into a number, string, or false.
// eslint-disable-next-line no-shadowed-variable
function normalizePort(val: any) {
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
const port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

// Create the HTTP server
const server = http.createServer(app);

function onError(error: any) {
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
