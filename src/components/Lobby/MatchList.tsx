import React from 'react';
import { useTranslation } from 'react-i18next';
import { LobbyAPI } from 'boardgame.io';

import { MemoMatchDetails as MatchDetails } from './MatchDetails';

interface MatchListProps {
  matches: LobbyAPI.Match[];
  userName: string;
}

export const MatchList: React.FC<MatchListProps> = (props) => {
  const { matches, userName } = props;
  const { t } = useTranslation();

  return (
    <>
      <p>{t('matchList.totalMatches', { matches })}</p>
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