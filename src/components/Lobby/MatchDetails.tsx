/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useContext } from 'react';
import { useHistory, Redirect } from 'react-router-dom';

import { LobbyAPI } from 'boardgame.io';
import { LobbyClient } from 'boardgame.io/client';
import { SocketIO } from "boardgame.io/multiplayer";
import { Client } from "boardgame.io/react";

import { GameServerContext } from '../GameServerProvider/GameServerProvider';
import { TicTacToe } from '../../Games/TicTacToe/Game';
import { TicTacToeBoard } from '../../Games/TicTacToe/Board';
import { KaticaGame } from '../../Games/Katica/Game';
import { KaticaBoard } from '../../Games/Katica/Board';
import { GameClientComponent } from '../GameClient/GameClient';
import { getObjectFromLocalStorage, mergeToObjectInLocalStorage, USER_MATCH_CREDENTIALS } from '../../utils/localStorageHelper';

interface MatchDetailProps {
  match: LobbyAPI.Match,
  userName: string;
  lobbyClient: LobbyClient;
}

export interface StoredMatchCredentials {
  [key: string]: MatchCredential;
}
export interface MatchCredential {
  credentials: string,
  playerID: string,
}

export const MatchDetails: React.FC<MatchDetailProps> = (props): JSX.Element => {
  const history = useHistory();
  const { gameServer } = useContext(GameServerContext);
  const { match, userName, lobbyClient } = props;
  const [joinedPlayers, setJoinedPlayers] = useState<string[]>([]);
  const [matchCredentials, setMatchCredentials] = useState<MatchCredential | null>(null);
  const [isMatchOn, setIsMatchOn] = useState(false);

  useEffect(() => {
    match.players.forEach(player => {
      if (!player.name) return;
      setJoinedPlayers(oldPlayers => [...oldPlayers, player.name as string]);
    })
  }, []);

  useEffect(() => {
    const localCreds = getObjectFromLocalStorage(USER_MATCH_CREDENTIALS);
    if (localCreds && localCreds[match.matchID]) {
      setMatchCredentials(localCreds[match.matchID] as MatchCredential);
    }
  }, []);

  const isJoinable = (): boolean => {
    return (joinedPlayers.length < match.players.length
      && !joinedPlayers.includes(userName));
  }

  const isStartable = (): boolean => {
    return (joinedPlayers.length === match.players.length
      && joinedPlayers.includes(userName));
  }

  const handleJoinMatch = async (match: LobbyAPI.Match) => {
    const emptySeat = match.players.find(player => !player.name);
    if (!emptySeat) {
      return;
    }

    try {
      const { playerCredentials } = await lobbyClient.joinMatch(
        match.gameName,
        match.matchID,
        {
          playerID: emptySeat.id.toString(),
          playerName: userName,
        }
      )
      const actualMatchCredentials = {
        credentials: playerCredentials,
        playerID: emptySeat.id.toString(),
      };
      setMatchCredentials(actualMatchCredentials);

      const actualUserMatchCredentials = {
        [match.matchID]: actualMatchCredentials,
      }
      mergeToObjectInLocalStorage(USER_MATCH_CREDENTIALS, actualUserMatchCredentials);
      setJoinedPlayers(oldPlayers => [...oldPlayers, userName]);
    } catch (error) {
      console.log('Error joining match:', error);
      alert(error.message);
    }
  }

  const handleStartMatch = () => {
    setIsMatchOn(true);
  }

  const TicTacToeClient = Client({
    game: TicTacToe,
    numPlayers: 2,
    board: TicTacToeBoard,
    multiplayer: SocketIO({
      server: gameServer,
    }),
  });

  const KaticaClient = Client({
    game: KaticaGame,
    numPlayers: 2,
    board: KaticaBoard,
    multiplayer: SocketIO({
      server: gameServer,
    }),
  });

  const getTicTacToeClient = () => {
    if (!matchCredentials) return null;
    return (
      <TicTacToeClient
        matchID={match.matchID}
        playerID={matchCredentials.playerID}
        credentials={matchCredentials.credentials}
        debug
      />
    );
  };

  const getKaticaClient = () => {
    if (!matchCredentials) return null;
    return (
      <KaticaClient
        matchID={match.matchID}
        playerID={matchCredentials.playerID}
        credentials={matchCredentials.credentials}
        debug
      />
    );
  };

  const redirectToMatchPage = () => {
    return (
      <Redirect to={`/match/${match.matchID}`} />
    );
    // window.open(`/match/${match.matchID}`);
    // if (!gameServer || !matchCredentials) return null;
    // if (match.gameName === 'tic-tac-toe') {
    //   return (
    //     <GameClientComponent
    //       game={TicTacToe}
    //       board={TicTacToeBoard}
    //       gameServer={gameServer}
    //       matchID={match.matchID}
    //       playerID={matchCredentials.playerID}
    //       credentials={matchCredentials.credentials}
    //       debug={false}
    //     />
    //   );
    // }
    // if (match.gameName === 'katica') {
    //   return (
    //     <GameClientComponent
    //       game={KaticaGame}
    //       board={KaticaBoard}
    //       gameServer={gameServer}
    //       matchID={match.matchID}
    //       playerID={matchCredentials.playerID}
    //       credentials={matchCredentials.credentials}
    //       debug={false}
    //     />
    //   );
    // }
  }

  return (
    <div>
      {match.gameName} - {match.matchID}. Players joined:
      <ul>
        {joinedPlayers.map(player => <li key={player}>{player}</li>)}
      </ul>
      {isJoinable()
        ? <button onClick={() => handleJoinMatch(match)}>Join!</button>
        : null}
      {isStartable()
        ? <button onClick={handleStartMatch}>Play match!</button>
        : null}
      {isMatchOn
        ? redirectToMatchPage()
        : null}
    </div>
  );
}