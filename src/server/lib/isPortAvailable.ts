import * as net from 'net';

export const isPortAvailable = (port: number) => new Promise<boolean>((resolve, reject) => {
  try {
    const tester: net.Server = net.createServer()
      .once('error', err => ((err as any).code == 'EADDRINUSE' ? resolve(false) : resolve(false) /* reject(err) */ ))
      .once('listening', () => tester.once('close', () => resolve(true)).close())
      .listen(port);
  } catch (error) {
    resolve(false)
    // reject(error);
  }
});
