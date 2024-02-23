import { userService } from '.';
import { ERRORS } from '../const';
import { db } from '../database';
import { Game, Room, RoomStatus, User } from '../types';
import shipSet from '../shipSet.json';

export const createNewGame = (room: Room): Game => {
  return room.createNewGame();
};

export const createNewSingleGame = (room: Room) => {
  const bot = userService.createNewBot();
  room.addPlayer(bot);
  const game = room.createNewGame(true);
  game.addShips(bot, shipSet);
  return game;
};

export const getGameById = (gameId: number): Game => {
  const room = db
    .getAllRooms()
    .filter((room) => room.status === RoomStatus.CLOSE)
    .find((room) => room.game?.index === gameId);
  if (!room?.game) {
    throw Error(ERRORS.GAME_DATA_NOT_FOUND);
  }
  return room.game;
};

export const finishAllUserGames = (user: User): Game[] => {
  const games = db.getAllRooms().reduce<Game[]>((games, room) => {
    if (room.users.indexOf(user) >= 0) {
      if (room.game && !room.game.gameOver) {
        games.push(room.game);
      }
    }
    return games;
  }, []);

  games.forEach((game) => game.finishGame(user));

  return games;
};

// const getRandomShipPosition = (): ShipPosition[] => {
//   return SHIP_SET.reduce<ShipPosition[]>((positions, shipType) => {
//     const direction = randomBoolean();
//     const { x, y } = getRandomShipCoordinates(positions, direction);
//     positions.push({
//       position: { x, y },
//       direction,
//       length: shipType.length,
//       type: shipType.type,
//     });
//     return positions;
//   }, []);
// };
