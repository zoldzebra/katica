import React from 'react';

import { LobbyAPI } from 'boardgame.io';

import { MemoMatchDetails as MatchDetails } from './MatchDetails';

interface MatchListProps {
  matches: LobbyAPI.Match[];
  userName: string;
  loadingMatches: boolean;
}

export const MatchList: React.FC<MatchListProps> = (props) => {
  const { matches, userName, loadingMatches } = props;

  const renderLoadingMessage = () => {
    return (
      <p>Loading matches</p>
    );
  };

  const renderMatchList = () => {
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
  };

  if (loadingMatches) {
    return renderLoadingMessage();
  }

  return renderMatchList();
}