import React, { FC } from 'react';
import Radio from '@material-ui/core/Radio';

interface MatchStarterSelectorProps {
  signAgreement: (eventIgnored: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  setMatchStarter: (matchStarter: string) => any;
  matchStarter: string;
  playerNames: string[];
}

export const MatchStarterSelector: FC<MatchStarterSelectorProps> = (props) => {
  const { setMatchStarter, signAgreement, matchStarter, playerNames } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMatchStarter(event.target.value);
  };


  const renderStarterSelector = () => {
    return playerNames.map((player, index) => {
      return (
        <Radio
          key={player}
          checked={Number(matchStarter) === index}
          onChange={handleChange}
          value={index.toString(10)}
          color="default"
          size="small"
        />
      )
    })
  };

  return (
    <div>
      <p>Who shall start the match?</p>
      {matchStarter}
      {renderStarterSelector()}
      <button onClick={signAgreement}>OK for me!</button>
    </div>
  );
}