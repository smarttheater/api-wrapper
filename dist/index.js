"use strict";
/**
 * Module dependencies.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const app_1 = require("./app/app");
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '8080');
// tslint:disable-next-line:no-backbone-get-set-outside-model
app_1.app.set('port', port);
/**
 * Create HTTP server.
 */
const server = http.createServer(app_1.app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const radix = 10;
    // tslint:disable-next-line:no-shadowed-variable
    const port = parseInt(val, radix);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    const ZERO = 0;
    if (port >= ZERO) {
        // port number
        return port;
    }
    return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string'
        ? `Pipe ${port}`
        : typeof port === 'number'
            ? `Port ${port}`
            : 'Port false';
    // handle specific listen errors with friendly messages
    const ONE = 1;
    if (error.code === 'EACCES') {
        // eslint-disable-next-line no-console
        console.error(bind + ' requires elevated privileges');
        process.exit(ONE);
    }
    if (error.code === 'EADDRINUSE') {
        // eslint-disable-next-line no-console
        console.error(bind + ' is already in use');
        process.exit(ONE);
    }
    throw error;
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : `port ${addr.port}`;
    bind;
}
