import type { ClientMessage } from '../types';

export const decodeRawMessage = (rawMessage: string): ClientMessage => {
  const { type, data: rawData } = JSON.parse(rawMessage);
  const data = JSON.parse(rawData);
  return { type, data } as ClientMessage<typeof type>;
};
