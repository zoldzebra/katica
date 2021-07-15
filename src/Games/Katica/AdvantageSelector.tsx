import React, { FC } from 'react';
import Radio from '@material-ui/core/Radio';

interface AdvantageSelectorProps {
  signAgreement: (eventIgnored: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  setAdvantage: (advantageLevel: number) => any;
  advantage: number;
}

export const AdvantageSelector: FC<AdvantageSelectorProps> = (props) => {
  const { setAdvantage, signAgreement, advantage } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdvantage(Number(event.target.value));
  };

  const advantageLevels = [0, 1, 2, 3, 4, 5];

  const renderRadioButtonsByAdvantageLevels = () => {
    return advantageLevels.map(level => {
      return (
        <Radio
          key={level}
          checked={level === advantage}
          onChange={handleChange}
          value={level}
          color="default"
          size="small"
        />
      )
    })
  }

  return (
    <div>
      YOU
      {renderRadioButtonsByAdvantageLevels()}
      OPPONENT
      <button onClick={signAgreement}>OK for me!</button>
    </div>
  );
}