import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Radio from '@material-ui/core/Radio';

interface AdvantageSelectorProps {
  setAdvantage: (advantageLevel: number) => any;
  advantage: number;
}

export const AdvantageSelector: FC<AdvantageSelectorProps> = (props) => {
  const { t } = useTranslation();
  const { setAdvantage, advantage } = props;

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
      <p>{t('katicaBoard.chooseAdvantage')}</p>
      {renderRadioButtonsByAdvantageLevels()}
    </div>
  );
}