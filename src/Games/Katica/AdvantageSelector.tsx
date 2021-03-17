import React, { FC } from 'react';
import Radio from '@material-ui/core/Radio';

interface AdvantageSelectorProps {
  setAdvantage: (advantageLevel: string) => any;
}

export const AdvantageSelector: FC<AdvantageSelectorProps> = (props) => {
  const { setAdvantage } = props;
  const [selectedValue, setSelectedValue] = React.useState('-6');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    setAdvantage(event.target.value);
  };

  const advantageLevels = [
    '-6', '-5', '-4', '-3', '-2', '-1', '1', '2', '3', '4', '5', '6'
  ];

  const renderRadioButtonsByAdvantageLevels = () => {
    return advantageLevels.map(level => {
      return (
        <Radio
          key={level}
          checked={selectedValue === level}
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
    </div>
  );
}