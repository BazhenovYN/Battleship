import { WebSocketServer } from 'ws';
import { MESSAGES } from '../const';
import { requestController } from '../controllers';
import { uuid } from '../utils';

export const startWsServer = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws) => {
    console.log(MESSAGES.CONNECTED);
    const userId = uuid();

    ws.on('message', (message) => requestController.handleRequest(wss, ws, userId, message));

    ws.on('close', () => console.log(MESSAGES.DISCONNECTED));

    ws.onerror = () => console.error;
  });
};
