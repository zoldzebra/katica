import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Radio from '@material-ui/core/Radio';

interface MatchStarterSelectorProps {
  setMatchStarter: (matchStarter: string) => any;
  matchStarter: string;
  playerNames: string[];
}

export const MatchStarterSelector: FC<MatchStarterSelectorProps> = (props) => {
  const { t } = useTranslation();
  const { setMatchStarter, matchStarter, playerNames } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMatchStarter(event.target.value);
  };


  const renderStarterSelector = () => {
    return playerNames.map((playerName, index) => {
      return (
        <div key={playerName}>
          {playerName}
          <Radio
            checked={Number(matchStarter) === index}
            onChange={handleChange}
            value={index.toString(10)}
            color="default"
            size="small"
          />
        </div>
      )
    })
  };

  return (
    <div>
      <p>{t('katicaBoard.whoGetsAdvantage')}</p>
      {renderStarterSelector()}
    </div>
  );
}