import React, { FC, useState, useEffect, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";

import { GameServerContext } from '../GameServerProvider/GameServerProvider';
import { StoredMatchCredentials } from '../Lobby/MatchDetails';
import { getObjectFromLocalStorage, USER_MATCH_CREDENTIALS } from '../../utils/localStorageHelper';
import { GameClientComponent } from '../GameClient/GameClient';
import { KaticaGame } from '../../Games/Katica/Game';
import { KaticaBoard } from '../../Games/Katica/Board';
import { TicTacToe } from '../../Games/TicTacToe/Game';
import { TicTacToeBoard } from '../../Games/TicTacToe/Board';

interface RouteMatchParams {
  matchID: string;
}

interface PlayedMatchCredentials {
  matchID: string,
  gameName: string;
  credentials: string,
  playerID: string,
}

export const MatchPage: FC<RouteComponentProps<RouteMatchParams>> = (props) => {
  const { gameServer } = useContext(GameServerContext);
  const { matchID } = props.match.params;
  const [playedMatchCredentials, setPlayedMatchCredentials] = useState<PlayedMatchCredentials | undefined>(undefined);
  const [loadingCredentials, setLoadingCredentials] = useState(true);
  const [gameAndBoard, setGameAndBoard] = useState<any>(undefined);

  useEffect(() => {
    const getLocalMatchCredentials = () => {
      const storedMatchCredentials = getObjectFromLocalStorage(USER_MATCH_CREDENTIALS);
      if (!storedMatchCredentials) return;
      const storedMatchIds = Object.keys(storedMatchCredentials);
      if (storedMatchIds.includes(matchID)) setPlayedMatchCredentials({
        matchID,
        gameName: (storedMatchCredentials as StoredMatchCredentials)[matchID].gameName,
        credentials: (storedMatchCredentials as StoredMatchCredentials)[matchID].credentials,
        playerID: (storedMatchCredentials as StoredMatchCredentials)[matchID].playerID
      });
    }
    getLocalMatchCredentials();
    setLoadingCredentials(false);
  }, []);

  useEffect(() => {
    if (!playedMatchCredentials) return;
    switch (playedMatchCredentials.gameName) {
      case 'katica':
        setGameAndBoard({
          game: KaticaGame,
          board: KaticaBoard,
        });
        break;
      case 'tic-tac-toe':
        setGameAndBoard({
          game: TicTacToe,
          board: TicTacToeBoard,
        });
        break;
      default: return;
    }
  }, [playedMatchCredentials])

  const loadIngCredentials = () => {
    return (
      <h1>Loading...</h1>
    )
  }

  const backToLobby = () => {
    console.log('no credentials');
    // redirect to lobby
    return (
      <h1>Match credentials not found, back to Lobby</h1>
    )
  }

  const displayGame = () => {
    if (!gameServer || !playedMatchCredentials || !gameAndBoard) return null;
    return (
      <GameClientComponent
        game={gameAndBoard.game}
        board={gameAndBoard.board}
        gameServer={gameServer}
        matchID={playedMatchCredentials.matchID}
        playerID={playedMatchCredentials.playerID}
        credentials={playedMatchCredentials.credentials}
        debug={false}
      />
    )
  }

  console.log('playedMatchCredentials', playedMatchCredentials);
  console.log('gameAndBoard', gameAndBoard);

  return (
    <div>
      <h1>This is the match page for {matchID}</h1>
      {loadingCredentials
        ? loadIngCredentials()
        : playedMatchCredentials
          ? displayGame()
          : backToLobby()}
    </div>
  );
}