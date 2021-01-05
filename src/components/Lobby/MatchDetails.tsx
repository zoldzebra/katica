import React from 'react';

import { LobbyAPI } from 'boardgame.io';

interface MatchDetailProps {
  match: LobbyAPI.Match,
}

export const MatchDetails: React.FC<MatchDetailProps> = (props): JSX.Element => {

  const { match } = props;

  return (
    <div>
      { match.gameName} - { match.matchID}.Players: { match.players.length}
      <button onClick={() => handleJoinMatch(match)}>Join!</button>
    </div>
  );
}