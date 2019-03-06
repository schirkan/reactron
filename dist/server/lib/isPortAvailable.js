"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
exports.isPortAvailable = (port) => new Promise((resolve, reject) => {
    try {
        const tester = net.createServer()
            .once('error', err => (err.code == 'EADDRINUSE' ? resolve(false) : resolve(false) /* reject(err) */))
            .once('listening', () => tester.once('close', () => resolve(true)).close())
            .listen(port);
    }
    catch (error) {
        resolve(false);
        // reject(error);
    }
});
//# sourceMappingURL=isPortAvailable.js.map