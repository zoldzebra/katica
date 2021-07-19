import React, { FC } from 'react';
import Switch from '@material-ui/core/Switch';

interface MatchTypeSelectorProps {
  setMatchType: (matchType: boolean) => any;
  isAdvantageMatch: boolean;
}

export const MatchTypeSelector: FC<MatchTypeSelectorProps> = (props) => {
  const { setMatchType, isAdvantageMatch } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMatchType(event.target.checked);
  };


  const renderAdvantageSelector = () => {
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
      {renderAdvantageSelector()}
    </div>
  );
}