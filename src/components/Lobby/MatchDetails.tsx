import React, { useEffect, useState } from 'react';

import { LobbyAPI } from 'boardgame.io';
import { LobbyClient } from 'boardgame.io/client';

import { MatchStatusOrAction } from './MatchStatusOrAction';
import { mergeToObjectInLocalStorage, USER_MATCH_CREDENTIALS } from '../../utils/localStorageHelper';

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
  // const history = useHistory();
  const { match, userName, lobbyClient } = props;
  const [joinedPlayers, setJoinedPlayers] = useState<string[]>([]);

  useEffect(() => {
    match.players.forEach(player => {
      if (!player.name) return;
      setJoinedPlayers(oldPlayers => [...oldPlayers, player.name as string]);
    })
  }, [match]);

  const handleJoinMatch = async () => {
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
      const actualUserMatchCredentials = {
        [match.matchID]: {
          gameName: match.gameName,
          credentials: playerCredentials,
          playerID: emptySeat.id.toString(),
        }
      };
      mergeToObjectInLocalStorage(USER_MATCH_CREDENTIALS, actualUserMatchCredentials);
      setJoinedPlayers(oldPlayers => [...oldPlayers, userName]);
    } catch (error) {
      console.log('Error joining match:', error);
      alert(error.message);
    }
  }

  return (
    <div>
      {match.gameName} - {match.matchID}. Players joined:
      <ul>
        {joinedPlayers.map(player => <li key={player}>{player}</li>)}
      </ul>
      <MatchStatusOrAction
        joinedPlayers={joinedPlayers}
        maxPlayers={match.players.length}
        userName={userName}
        handleJoinMatch={handleJoinMatch}
        matchID={match.matchID}
      />
    </div>
  );
}