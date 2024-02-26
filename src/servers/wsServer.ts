import { WebSocketServer } from 'ws';
import { MESSAGES } from '../const';
import { requestController } from '../controllers';
import { uuid } from '../utils';

export const startWsServer = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws) => {
    console.log(MESSAGES.CLIENT_CONNECTED);
    const userId = uuid();

    ws.on('message', (message) => {
      try {
        requestController.handleClientMessage(wss, ws, userId, message);
      } catch (error) {
        console.error(error);
      }
    });

    ws.on('close', () => {
      try {
        requestController.handleDisconnect(wss, userId);
      } catch (error) {
        console.error(error);
      }
    });

    ws.onerror = () => console.error;
  });
};
