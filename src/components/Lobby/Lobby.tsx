import React, { useState, useEffect, useContext } from 'react';
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
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>({
    id: '',
    email: '',
    userName: '',
  });
  const [gameNames, setGameNames] = useState<string[]>([]);
  const [matches, setMatches] = useState<LobbyAPI.Match[]>([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const actualUserInfo = user && await getUserInfo(user);
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

  const handleLogoutClick = async (event: any) => {
    event.preventDefault();
    await signOutUser();
    history.push("/auth/login");
  }

  const handleCreateNewMatch = async (event: any) => {
    event.preventDefault();
    await lobbyClient.createMatch('katica', {
      numPlayers: 2
    });
  }

  const handleJoinMatch = async (match: LobbyAPI.Match) => {
    console.log('match', match)
    try {
      await lobbyClient.joinMatch(
        'katica',
        match.matchID,
        {
          playerID: '1',
          playerName: username,
        }
      )
    } catch (error) {
      console.log('Error joining match:', error);
      alert(error.message);
    }
  }

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
        {matches && matches.map(match =>
          <li key={match.matchID}>
            {match.gameName}-{match.matchID}. Players: {match.players.length}
            <button onClick={() => handleJoinMatch(match)}>Join!</button>
          </li>)}
      </ul>
      <button onClick={handleCreateNewMatch}>Create new KATICA match</button>
    </Paper>
  );
}