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
    const setAllMatches = async () => {
      const promises = gameNames.map((gameName) => lobbyClient.listMatches(gameName));
      const allMatchLists = await Promise.all(promises);
      let allMatches: LobbyAPI.Match[] = [];
      allMatchLists.forEach(matchList => allMatches = [...matchList.matches]);
      if (allMatches.length === 0) {
        return;
      }
      setMatches(allMatches);
    }
    setAllMatches();
  }, [gameNames]);

  useEffect(() => {
    if (matches.length === 0) return;
    const syncLocalStorageWithMatches = () => {
      const storedMatchCredentials = getObjectFromLocalStorage(USER_MATCH_CREDENTIALS);
      if (!storedMatchCredentials) return;
      const storedMatchIds = Object.keys(storedMatchCredentials);
      const syncedMatchCredentials: Record<string, unknown> = {};

      const matchIds = matches.map(match => match.matchID)
      storedMatchIds.forEach(storedMatchId => {
        if (matchIds.includes(storedMatchId)) {
          syncedMatchCredentials[storedMatchId] = storedMatchCredentials[storedMatchId];
        }
      })
      localStorage.setItem(USER_MATCH_CREDENTIALS, JSON.stringify(syncedMatchCredentials));
    }
    syncLocalStorageWithMatches();
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
            <li key={gameName}>{gameName}
              <button onClick={() => handleCreateNewMatch(gameName)}>
                Create new match
              </button>
            </li>
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