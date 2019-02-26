"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
exports.isPortAvailable = (port) => new Promise((resolve, reject) => {
    const tester = net.createServer()
        .once('error', err => (err.code == 'EADDRINUSE' ? resolve(false) : reject(err)))
        .once('listening', () => tester.once('close', () => resolve(true)).close())
        .listen(port);
});
//# sourceMappingURL=isPortAvailable.js.map