import React from 'react';

import { LobbyAPI } from 'boardgame.io';

import { MemoMatchDetails as MatchDetails } from './MatchDetails';

interface MatchListProps {
  matches: LobbyAPI.Match[];
  userName: string;
}

export const MatchList: React.FC<MatchListProps> = (props) => {
  const { matches, userName } = props;

  return (
    <>
      <p>There are a total of {matches.length} matches now:</p>
      <ul>
        {matches && matches.map(match =>
          <li key={match.matchID}>
            <MatchDetails
              match={match}
              userName={userName}
            />
          </li>)}
      </ul>
    </>
  );
}