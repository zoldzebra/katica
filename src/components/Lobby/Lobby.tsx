import React, { useState, useEffect, useContext } from 'react';
import { Paper } from '@material-ui/core';
import { useHistory } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { LobbyClient } from 'boardgame.io/client';
import { LobbyAPI } from 'boardgame.io';

import { getUserInfo } from '../../Services/userService';
import firebaseApp from "../../Firebase/firebaseApp";
import { APP_PRODUCTION, LOCAL_SERVER_URL } from '../../config';
import { AuthContext } from '../AuthProvider/AuthProvider';

export const Lobby = (): JSX.Element => {
  const { user } = useContext(AuthContext);

  const { protocol, hostname, port } = window.location;
  const history = useHistory();
  const server = APP_PRODUCTION
    ? `${protocol}//${hostname}:${port}`
    : LOCAL_SERVER_URL;
  const lobbyClient = new LobbyClient({ server });

  const [userInfo, setUserInfo] = useState<firebase.firestore.DocumentData | undefined>({
    email: '',
    userName: '',
  });
  const [games, setGames] = useState<string[]>([]);
  const [matches, setMatches] = useState<LobbyAPI.Match[]>([]);

  const handleLogoutClick = (event: any) => {
    event.preventDefault();
    firebaseApp
      .auth()
      .signOut()
      .then(() => {
        history.push("/auth/login");
      })
  }

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
      setGames(gamesList);
    }
    fetchGames();
  }, []);

  useEffect(() => {
    const fetchGameMatches = async (game: string): Promise<void> => {
      const gameMatches = await lobbyClient.listMatches(game);
      setMatches(oldMatches => [...oldMatches, ...gameMatches.matches]);
    }
    games.forEach(game => fetchGameMatches(game));
  }, [games]);

  return (
    <Paper>
      <p>Username: {userInfo?.userName}, email: {userInfo?.email}</p>
      <button onClick={handleLogoutClick}>Logout</button>
      <h1>Katica Lobby</h1>
      <p>Welcome to the Lobby!</p>
      <p>Available games:</p>
      <ul>
        {games.map(game => <li key={game}>{game}</li>)}
      </ul>
      <p>There are a total of {matches.length} matches now:</p>
      <ul>
        {matches
          ? matches.map(match => <li key={match.matchID}>{match.gameName}-{match.matchID}</li>)
          : null}
      </ul>
    </Paper>
  );
}