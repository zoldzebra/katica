import React, { FC } from 'react';
import Switch from '@material-ui/core/Switch';

interface MatchTypeSelectorProps {
  signAgreement: (eventIgnored: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  setMatchType: (matchType: boolean) => any;
  isAdvantageMatch: boolean;
}

export const MatchTypeSelector: FC<MatchTypeSelectorProps> = (props) => {
  const { setMatchType, signAgreement, isAdvantageMatch } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMatchType(event.target.checked);
  };


  const renderRadioButtonsByMatchTypes = () => {
    return (
      <Switch
        checked={isAdvantageMatch}
        onChange={handleChange}
      />
    )
  };

  return (
    <div>
      <p>Advantage match?</p>
      {renderRadioButtonsByMatchTypes()}
      <button onClick={signAgreement}>OK for me!</button>
    </div>
  );
}