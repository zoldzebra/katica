/* eslint-disable no-undef */
import { Server } from 'boardgame.io/server';
import path from 'path';
import serve from 'koa-static';
import { TicTacToe } from './Games/TicTacToe/Game';
import { KaticaGame } from './Games/Katica/game';

const server = Server({ games: [TicTacToe, KaticaGame] });
const PORT = Number(process.env.PORT) || 8000;

// Build path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, './../build');
server.app.use(serve(frontEndAppBuildPath));

console.log('frontEndAppBuildPath', frontEndAppBuildPath);
console.log('port:', PORT);

server.run(PORT, () => {
  console.log('server.run started');
  server.app.use(
    async (ctx, next) => await serve(frontEndAppBuildPath)(
      Object.assign(ctx, { path: 'index.html' }),
      next
    )
  )
});