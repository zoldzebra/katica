import React, { FC, useState, useEffect } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";

import { MatchComponent } from './MatchComponent';
import { StoredMatchCredentials } from '../Lobby/MatchDetails';
import { getObjectFromLocalStorage, USER_MATCH_CREDENTIALS } from '../../utils/localStorageHelper';
import { KaticaGame } from '../../Games/Katica/Game';
import { KaticaBoard } from '../../Games/Katica/Board';
import { TicTacToe } from '../../Games/TicTacToe/Game';
import { TicTacToeBoard } from '../../Games/TicTacToe/Board';

interface RouteMatchParams {
  matchID: string;
}

export interface PlayedMatchCredentials {
  matchID: string,
  gameName: string;
  credentials: string,
  playerID: string,
}

export const MatchPage: FC<RouteComponentProps<RouteMatchParams>> = (props) => {
  const history = useHistory();
  const { matchID } = props.match.params;
  const [playedMatchCredentials, setPlayedMatchCredentials] = useState<PlayedMatchCredentials | undefined>(undefined);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(true);
  const [gameAndBoard, setGameAndBoard] = useState<any>(undefined);

  useEffect(() => {
    const getLocalMatchCredentials = () => {
      const storedMatchCredentials = getObjectFromLocalStorage(USER_MATCH_CREDENTIALS);
      if (!storedMatchCredentials) {
        return;
      }
      const storedMatchIds = Object.keys(storedMatchCredentials);
      if (storedMatchIds.includes(matchID)) {
        setPlayedMatchCredentials({
          matchID,
          gameName: (storedMatchCredentials as StoredMatchCredentials)[matchID].gameName,
          credentials: (storedMatchCredentials as StoredMatchCredentials)[matchID].credentials,
          playerID: (storedMatchCredentials as StoredMatchCredentials)[matchID].playerID
        });
      }
    }
    getLocalMatchCredentials();
    setIsLoadingCredentials(false);
  }, []);

  useEffect(() => {
    if (!playedMatchCredentials) {
      return;
    }
    if (playedMatchCredentials.gameName === 'katica') {
      setGameAndBoard({
        game: KaticaGame,
        board: KaticaBoard,
      });
    }
    if (playedMatchCredentials.gameName === 'tic-tac-toe') {
      setGameAndBoard({
        game: TicTacToe,
        board: TicTacToeBoard,
      });
    }
  }, [playedMatchCredentials]);

  const loadingCredentials = () => {
    return (
      <h1>Loading...</h1>
    )
  }

  const noCredentialsBackToLobby = () => {
    return (
      <>
        <p>Sorry, match credentials not found.</p>
        <button onClick={() => history.push('/lobby')}>Back to lobby</button>
      </>
    )
  }

  const renderMatchOrBackToLobby = () => {
    if (isLoadingCredentials) {
      return loadingCredentials();
    }
    if (!isLoadingCredentials && playedMatchCredentials && gameAndBoard) {
      return (
        <MatchComponent
          gameAndBoard={gameAndBoard}
          playedMatchCredentials={playedMatchCredentials}
        />
      )
    }
    if (!isLoadingCredentials && !playedMatchCredentials) {
      return noCredentialsBackToLobby();
    }
  }

  return (
    <div>
      <h1>This is the match page for {matchID}</h1>
      {renderMatchOrBackToLobby()}
    </div>
  );
}