import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import * as R from 'ramda';

import { LobbyAPI } from 'boardgame.io';
import { GameServerContext } from '../GameServerProvider/GameServerProvider';

import { MatchStatusOrAction } from './MatchStatusOrAction';
import {
  getObjectFromLocalStorage,
  mergeToObjectInLocalStorage,
  USER_MATCH_CREDENTIALS,
} from '../../utils/localStorageHelper';

export interface StoredMatchCredentials {
  [key: string]: MatchCredential;
}
export interface MatchCredential {
  gameName: string;
  credentials: string,
  playerID: string,
}
interface MatchDetailProps {
  match: LobbyAPI.Match,
  userName: string;
}

export const MatchDetails: React.FC<MatchDetailProps> = (props): JSX.Element => {
  const { match, userName } = props;
  const history = useHistory();
  const { lobbyClient } = useContext(GameServerContext);
  const [joinedPlayers, setJoinedPlayers] = useState<string[]>([]);

  useEffect(() => {
    const playerList = match.players
      .filter(player => typeof player.name !== 'undefined')
      .map(player => player.name as string);
    setJoinedPlayers(playerList);
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

  const handleLeaveMatch = async () => {
    try {
      const storedMatchCredentials = getObjectFromLocalStorage(USER_MATCH_CREDENTIALS) as StoredMatchCredentials | undefined;
      if (!storedMatchCredentials) {
        return;
      }
      const matchCredentials = (storedMatchCredentials)[match.matchID];

      await lobbyClient.leaveMatch(
        match.gameName,
        match.matchID,
        {
          playerID: matchCredentials.playerID,
          credentials: matchCredentials.credentials,
        }
      );
    } catch (error) {
      console.log('Error leaving match:', error);
      alert(error.message);
    }
  }

  const handlePlayMatch = () => {
    history.push(`/match/${match.matchID}`);
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
        handleLeaveMatch={handleLeaveMatch}
        handlePlayMatch={handlePlayMatch}
      />
    </div>
  );
}

export const MemoMatchDetails = React.memo(MatchDetails, (prevProps, nextProps) => R.equals(prevProps.match, nextProps.match));