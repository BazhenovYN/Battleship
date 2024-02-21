import { HTTP_PORT, MESSAGES, WS_PORT } from './const';
import { httpServer, startWsServer } from './servers';

console.log(MESSAGES.START_HTTP_SERVER, HTTP_PORT);
httpServer.listen(HTTP_PORT);

console.log(MESSAGES.START_WEBSOCKET_SERVER, WS_PORT);
startWsServer(WS_PORT);
