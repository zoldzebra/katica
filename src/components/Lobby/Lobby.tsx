import React, { useState, useEffect, useContext, MouseEvent } from 'react';
import { Paper } from '@material-ui/core';
import { useHistory } from "react-router-dom";

import { LobbyClient } from 'boardgame.io/client';
import { LobbyAPI } from 'boardgame.io';

import { getUserInfo, signOutUser, UserInfo } from '../../Services/userService';
import { AuthContext } from '../AuthProvider/AuthProvider';
import { GameServerContext } from '../GameServerProvider/GameServerProvider';
import { MatchDetails } from './MatchDetails';
import { getObjectFromLocalStorage, USER_MATCH_CREDENTIALS } from '../../utils/localStorageHelper';

export const Lobby = (): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { gameServer } = useContext(GameServerContext);
  const history = useHistory();
  const lobbyClient = new LobbyClient({ server: gameServer });
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [gameNames, setGameNames] = useState<string[]>([]);
  const [matches, setMatches] = useState<LobbyAPI.Match[]>([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) {
        setUserInfo(null)
        return;
      }
      const actualUserInfo = await getUserInfo(user);
      setUserInfo(actualUserInfo);
    }
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchGames = async (): Promise<void> => {
      const gamesList = await lobbyClient.listGames();
      setGameNames(gamesList);
    }
    fetchGames();
  }, []);

  useEffect(() => {
    let tempMatchList = matches;
    const fetchMatches = async (game: string): Promise<void> => {
      const gameMatches = await lobbyClient.listMatches(game);
      tempMatchList = [...tempMatchList, ...gameMatches.matches];
      console.log({ tempMatchList });
    }
    for (const gameName of gameNames) {
      fetchMatches(gameName);
    }
    console.log('only once'); // this should run after the server calls...
    setMatches(oldMatches => [...oldMatches, ...tempMatchList]);
  }, [gameNames]);

  useEffect(() => {
    if (matches.length === 0) return;
    console.log(matches);
    const syncLocalStorageMatches = () => {
      const matchCredentials = getObjectFromLocalStorage(USER_MATCH_CREDENTIALS);
      if (!matchCredentials) return;
      const storedMatchIds = Object.keys(matchCredentials);
      const syncedMatchCredentials: Record<string, unknown> = {};
      storedMatchIds.forEach(storedMatchId => {
        matches.forEach(match => {
          if (match.matchID === storedMatchId) {
            syncedMatchCredentials[storedMatchId] = matchCredentials[storedMatchId];
            return;
          }
        });
      })
      localStorage.setItem(USER_MATCH_CREDENTIALS, JSON.stringify(syncedMatchCredentials));
    }
    syncLocalStorageMatches();
  }, [matches]);

  const handleLogoutClick = async (event: MouseEvent) => {
    event.preventDefault();
    await signOutUser();
    history.push("/auth/login");
  }

  const handleCreateNewMatch = async (gameName: string) => {
    const newMatchID = await lobbyClient.createMatch(gameName, {
      numPlayers: 2
    });
    const newMatch = await lobbyClient.getMatch(gameName, newMatchID.matchID);
    setMatches(oldMatches => [...oldMatches, newMatch])
  }

  const userName = userInfo?.userName ?? '-';
  const email = userInfo?.email ?? '-';

  return (
    <Paper>
      <p>Username: {userName}, email: {email}</p>
      <button onClick={handleLogoutClick}>Logout</button>
      <h1>Katica Lobby</h1>
      <p>Welcome to the Lobby!</p>
      <p>Available games:</p>
      <ul>
        {gameNames.map((gameName) => {
          return (
            <li key={gameName}>{gameName} <button onClick={() => handleCreateNewMatch(gameName)}>Create new match</button></li>
          )
        })
        }
      </ul>
      <p>There are a total of {matches.length} matches now:</p>
      <ul>
        {matches && matches.map(match =>
          <li key={match.matchID}>
            <MatchDetails
              match={match}
              userName={userName}
              lobbyClient={lobbyClient}
            />
          </li>)}
      </ul>
    </Paper>
  );
}