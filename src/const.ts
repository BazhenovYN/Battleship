export const HTTP_PORT = 8181;
export const WS_PORT = 3000;

export const NUMBER_OF_PLAYERS_FOR_A_GAME = 2;

export const SHIP_WIDTH = 1;

export const FIELD_SIZE = 10;

export const ERRORS = {
  UNKNOWN_MESSAGE_TYPE: 'Unknown message type',
  GAME_DATA_NOT_FOUND: 'Game data not found',
  USER_NOT_FOUND: 'User not found',
  INVALID_PASSWORD: 'Invalid password',
};

export const MESSAGES = {
  START_HTTP_SERVER: 'Start static http server on the %s port',
  START_WEBSOCKET_SERVER: 'Start WebSocket server on the %s port',
  CLIENT_CONNECTED: 'New client connected',
  CLIENT_DISCONNECTED: 'Client disconnected',
};
