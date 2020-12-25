import React, { useState } from 'react';
import { Input, Paper } from '@material-ui/core';

export const Lobby = (): JSX.Element => {
  const [playerName, setPlayerName] = useState('');

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
    </Paper>
  );
}