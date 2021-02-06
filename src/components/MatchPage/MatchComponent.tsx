import React, { FC, useContext } from "react";
import { useHistory } from "react-router-dom";

import { GameServerContext } from '../GameServerProvider/GameServerProvider';
import { GameClientComponent } from '../GameClient/GameClient';
import { PlayedMatchCredentials } from './MatchPage';

interface MatchComponentProps {
  gameAndBoard: any,
  playedMatchCredentials: PlayedMatchCredentials,
}

export const MatchComponent: FC<MatchComponentProps> = (props) => {
  const history = useHistory();
  const { gameServer, lobbyClient } = useContext(GameServerContext);
  const { gameAndBoard, playedMatchCredentials } = props;

  const leaveMatch = async () => {
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

  return (
    <>
      <button onClick={leaveMatch}>Leave match and back to lobby</button>
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