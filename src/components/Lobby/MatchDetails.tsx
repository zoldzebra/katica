import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { LobbyAPI } from 'boardgame.io';
import { LobbyClient } from 'boardgame.io/client';

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
  gameName: string;
  credentials: string,
  playerID: string,
}

export const MatchDetails: React.FC<MatchDetailProps> = (props): JSX.Element => {
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

  const isFull = (): boolean => {
    return joinedPlayers.length === match.players.length;
  }

  const isJoined = (): boolean => {
    return joinedPlayers.includes(userName);
  }

  const matchStatusOrAction = (): JSX.Element => {
    if (isFull()) {
      if (isJoined()) {
        return (
          <button onClick={handleStartMatch}>Play match!</button>
        )
      }
      return (
        <p>
          Match is full.
        </p>
      )
    }
    if (isJoined()) {
      return (
        <p>
          Waiting for others to join...
        </p>
      )
    }
    return (
      <button onClick={() => handleJoinMatch(match)}>Join!</button>
    )
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
        gameName: match.gameName,
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

  const redirectToMatchPage = () => {
    if (!matchCredentials) return null;
    return (
      <Redirect to={`/match/${match.matchID}`} />
    );
  }

  return (
    <div>
      {match.gameName} - {match.matchID}. Players joined:
      <ul>
        {joinedPlayers.map(player => <li key={player}>{player}</li>)}
      </ul>
      {matchStatusOrAction()}
      {isMatchOn
        ? redirectToMatchPage()
        : null}
    </div>
  );
}