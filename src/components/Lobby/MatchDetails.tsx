import React from 'react';

import { LobbyAPI } from 'boardgame.io';

interface MatchDetailProps {
  match: LobbyAPI.Match,
  handleJoinMatch: (match: LobbyAPI.Match, playerID: number) => Promise<void>;
}

export const MatchDetails: React.FC<MatchDetailProps> = (props): JSX.Element => {

  const { match, handleJoinMatch } = props;

  console.log('match', match);

  const joinedPlayers = match.players.reduce((acc, curr) => {
    return curr.name
      ? acc + 1
      : acc;
  }, 0);
  console.log('joinedPlayers', joinedPlayers);
  const joinPlayer = match.players.find(player => !player.name);

  return (
    <div>
      { match.gameName} - { match.matchID}. Players joined: { joinedPlayers}
      {joinPlayer
        ? <button onClick={() => handleJoinMatch(match, joinPlayer.id)}>Join!</button>
        : null}
    </div>
  );
}