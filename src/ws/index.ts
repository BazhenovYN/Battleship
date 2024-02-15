import { WebSocketServer } from 'ws';

export const startWsServer = () => {
  const wss = new WebSocketServer({ port: 3000 });

  wss.on('connection', (ws) => {
    console.log('New client connected!');
    ws.send(JSON.stringify({ data: 'test' }));
    ws.on('close', () => console.log('Client has disconnected!'));
    ws.on('message', (data) => {
      wss.clients.forEach((client) => {
        console.log(`distributing message: ${data}`);
        client.send(`${data}`);
      });
    });
    ws.onerror = function () {
      console.log('websocket error');
    };
  });

  return wss;
};
