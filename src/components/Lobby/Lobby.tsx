import React, { useState, useEffect, useContext, MouseEvent } from 'react';
import { Paper } from '@material-ui/core';
import { useHistory } from "react-router-dom";

import { LobbyClient } from 'boardgame.io/client';
import { LobbyAPI } from 'boardgame.io';

import { getUserInfo, signOutUser, UserInfo } from '../../Services/userService';
import { AuthContext } from '../AuthProvider/AuthProvider';
import { GameServerContext } from '../GameServerProvider/GameServerProvider';

export const Lobby = (): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { gameServer } = useContext(GameServerContext);
  const history = useHistory();
  const lobbyClient = new LobbyClient({ server: gameServer });
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [gameNames, setGameNames] = useState<string[]>([]);
  const [matches, setMatches] = useState<LobbyAPI.Match[]>([]);

  const handleLogoutClick = async (event: MouseEvent) => {
    event.preventDefault();
    await signOutUser();
    history.push("/auth/login");
  }

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
    const fetchGameMatches = async (game: string): Promise<void> => {
      const gameMatches = await lobbyClient.listMatches(game);
      setMatches(oldMatches => [...oldMatches, ...gameMatches.matches]);
    }
    gameNames.forEach(game => fetchGameMatches(game));
  }, [gameNames]);

  const username = userInfo?.userName ?? '-';
  const email = userInfo?.email ?? '-';

  return (
    <Paper>
      <p>Username: {username}, email: {email}</p>
      <button onClick={handleLogoutClick}>Logout</button>
      <h1>Katica Lobby</h1>
      <p>Welcome to the Lobby!</p>
      <p>Available games:</p>
      <ul>
        {gameNames.map(gameName => <li key={gameName}>{gameName}</li>)}
      </ul>
      <p>There are a total of {matches.length} matches now:</p>
      <ul>
        {matches && matches.map(match => <li key={match.matchID}>{match.gameName}-{match.matchID}</li>)}
      </ul>
    </Paper>
  );
}