import React, { useState, useEffect } from 'react';
import { Input, Paper } from '@material-ui/core';

import { LobbyClient } from 'boardgame.io/client';
import { LobbyAPI } from 'boardgame.io';

import { APP_PRODUCTION, LOCAL_SERVER_URL } from '../../config';

export const Lobby = (): JSX.Element => {
  const { protocol, hostname, port } = window.location;
  const server = APP_PRODUCTION
    ? `${protocol}//${hostname}:${port}`
    : LOCAL_SERVER_URL;
  const lobbyClient = new LobbyClient({ server });

  const [playerName, setPlayerName] = useState<string>('');
  const [games, setGames] = useState<string[]>([]);
  const [matches, setMatches] = useState<LobbyAPI.Match[]>([]);


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

  const handlePlayerNameChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    setPlayerName(event.target.value);
  }

  return (
    <Paper>
      <h1>Katica Lobby</h1>
      <p>Welcome to the Lobby! Please add your name:</p>
      <p>{playerName}</p>
      <form>
        <Input placeholder="Player name" value={playerName} onChange={handlePlayerNameChange} />
      </form>
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