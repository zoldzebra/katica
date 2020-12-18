import { Server } from 'boardgame.io/server';
import { TicTacToe } from './src/Games/TicTacToe/Game';
import { KaticaGame } from './KaticaGameBuild/Game';
import { LOCAL_SERVER_PORT } from './src/config';
const localServer = Server({ games: [TicTacToe, KaticaGame] });

localServer.run(LOCAL_SERVER_PORT);
