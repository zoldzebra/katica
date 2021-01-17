import React, { useEffect, useState, useContext } from 'react';

import { LobbyAPI } from 'boardgame.io';
import { LobbyClient } from 'boardgame.io/client';
import { SocketIO } from "boardgame.io/multiplayer";
import { Client } from "boardgame.io/react";

import { GameServerContext } from '../GameServerProvider/GameServerProvider';
import { TicTacToe } from '../../Games/TicTacToe/Game';
import { TicTacToeBoard } from '../../Games/TicTacToe/Board';
import { getObjectFromLocalStorage, mergeToObjectInLocalStorage, USER_MATCH_CREDENTIALS } from '../../utils/localStorageHelper';

interface MatchDetailProps {
  match: LobbyAPI.Match,
  userName: string;
  lobbyClient: LobbyClient;
}

interface MatchCredentials {
  credentials: string,
  playerID: string,
}

export const MatchDetails: React.FC<MatchDetailProps> = (props): JSX.Element => {
  const { gameServer } = useContext(GameServerContext);
  const { match, userName, lobbyClient } = props;
  const [joinedPlayers, setJoinedPlayers] = useState<string[]>([]);
  const [matchCredentials, setMatchCredentials] = useState<MatchCredentials | null>(null);
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
      setMatchCredentials(localCreds[match.matchID] as MatchCredentials);
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

  const getTicTacToeClient = () => {
    if (!matchCredentials) return null;
    console.log(`Creating match w playerID ${matchCredentials.playerID}, creds: ${matchCredentials.credentials}`);
    return (
      <TicTacToeClient
        matchID={match.matchID}
        playerID={matchCredentials.playerID}
        credentials={matchCredentials.credentials}
      />
    );
  };

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
        ? getTicTacToeClient()
        : null}
    </div>
  );
}