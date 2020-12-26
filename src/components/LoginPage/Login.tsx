import React, { useState } from 'react';
import { Input, Paper } from '@material-ui/core';

export const Login = (): JSX.Element => {
  const [playerName, setPlayerName] = useState<string>('');

  const handlePlayerNameChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    setPlayerName(event.target.value);
  }

  return (
    <Paper>
      <h1>Dummy login page</h1>
      <p>Please add your name:</p>
      <p>{playerName}</p>
      <form>
        <Input placeholder="Player name" value={playerName} onChange={handlePlayerNameChange} />
      </form>
    </Paper>
  );
}