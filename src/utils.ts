import { createHash } from 'node:crypto';
import { Coordinates } from './types';

export const hash = (data: string): string => {
  return createHash('sha256').update(data).digest('hex');
};

export const uuid = (): number => Date.now();

export const getRandomCoordinates = (max: number, exceptions: Coordinates[]): Coordinates => {
  const generateRandomCoordinates = (): Coordinates => {
    const x = getRandomInt(0, max);
    const y = getRandomInt(0, max);
    if (exceptions.some((curr) => curr.x === x && curr.y === y)) {
      return generateRandomCoordinates();
    } else {
      return { x, y };
    }
  };

  return generateRandomCoordinates();
};

const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);

export const randomBoolean = () => Math.random() < 0.5;

export const getRandomValue = <T>(value1: T, value2: T): T => {
  return randomBoolean() ? value1 : value2;
};
