import { createHash } from 'node:crypto';

export const hash = (data: string): string => {
  return createHash('sha256').update(data).digest('hex');
};

export const uuid = (): number => Date.now();

export const getRandomCoordinates = (max: number) => {
  return {
    x: getRandomInt(0, max),
    y: getRandomInt(0, max),
  };
};
const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);
