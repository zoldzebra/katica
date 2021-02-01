import React, { FC, useState, useEffect, useContext } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";

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
  const history = useHistory();
  const { gameServer, lobbyClient } = useContext(GameServerContext);
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

  const leaveMatch = async () => {
    if (!playedMatchCredentials) {
      // give some feedback here...
      return;
    }
    try {
      await lobbyClient.leaveMatch(
        playedMatchCredentials.gameName,
        playedMatchCredentials.matchID,
        {
          playerID: playedMatchCredentials.playerID,
          credentials: playedMatchCredentials.credentials,
        }
      );
    } catch (error) {
      console.log('Error leaving match:', error);
      alert(error.message);
    }
    history.push('/lobby');
  }

  const loadIngCredentials = () => {
    return (
      <h1>Loading...</h1>
    )
  }

  const backToLobby = () => {
    return (
      <>
        <p>Sorry, match credentials not found.</p>
        <button onClick={() => history.push('/lobby')}>Back to lobby</button>
      </>
    )
  }

  const displayGame = () => {
    if (!gameServer || !playedMatchCredentials || !gameAndBoard) return null;
    return (
      <>
        <button onClick={() => leaveMatch()}>Leave match and back to lobby</button>
        <GameClientComponent
          game={gameAndBoard.game}
          board={gameAndBoard.board}
          gameServer={gameServer}
          matchID={playedMatchCredentials.matchID}
          playerID={playedMatchCredentials.playerID}
          credentials={playedMatchCredentials.credentials}
          debug={false}
        />
      </>
    )
  }

  const renderMatchOrBackToLobby = () => {
    if (isLoadingCredentials) {
      return loadIngCredentials();
    }
    if (!isLoadingCredentials && playedMatchCredentials) {
      return displayGame();
    }
    if (!isLoadingCredentials && !playedMatchCredentials) {
      return backToLobby();
    }
  }

  return (
    <div>
      <h1>This is the match page for {matchID}</h1>
      {renderMatchOrBackToLobby()}
    </div>
  );
}