import { httpServer } from './http_server';
import { startWsServer } from './ws';

import { HTTP_PORT, WS_PORT } from './const';

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

console.log(`Start WebSocket server on the ${WS_PORT} port!`);
startWsServer(WS_PORT);
