/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState, useEffect } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";

import { StoredMatchCredentials } from '../Lobby/MatchDetails';
import { getObjectFromLocalStorage, USER_MATCH_CREDENTIALS } from '../../utils/localStorageHelper';


interface RouteMatchParams {
  matchID: string;
}

interface PlayedMatchCredentials {
  matchID: string,
  credentials: string,
  playerID: string,
}

export const MatchComponent: FC<RouteComponentProps<RouteMatchParams>> = (props) => {
  const history = useHistory();
  const { matchID } = props.match.params;
  const [playedMatchCredentials, setPlayedMatchCredentials] = useState<PlayedMatchCredentials | undefined>(undefined);
  const [loadingCredentials, setLoadingCredentials] = useState(true);

  useEffect(() => {
    const getLocalMatchCredentials = () => {
      const storedMatchCredentials = getObjectFromLocalStorage(USER_MATCH_CREDENTIALS);
      if (!storedMatchCredentials) return;
      const storedMatchIds = Object.keys(storedMatchCredentials);
      if (storedMatchIds.includes(matchID)) setPlayedMatchCredentials({
        matchID,
        credentials: (storedMatchCredentials as StoredMatchCredentials)[matchID].credentials,
        playerID: (storedMatchCredentials as StoredMatchCredentials)[matchID].playerID
      });
    }
    getLocalMatchCredentials();
    setLoadingCredentials(false);
  }, []);

  const loadIngCredentials = () => {
    return (
      <h1>Loading...</h1>
    )
  }

  const backToLobby = () => {
    console.log('no credentials');
    // history.push("/lobby");
    return (
      <h1>Match credentials not found, back to Lobby</h1>
    )
  }

  const displayGame = () => {
    return (
      <h1>
        THE MATCH WILL BE HERE
      </h1>
    )
  }

  console.log('playedMatchCredentials', playedMatchCredentials);

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