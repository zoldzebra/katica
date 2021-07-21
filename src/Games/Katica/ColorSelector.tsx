import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Color } from './Board';

interface ColorSelectorProps {
  switchPlayerColors: () => void;
  isPlayer0Red: boolean;
  playerNames: string[];
}

export const ColorSelector: FC<ColorSelectorProps> = (props) => {
  const { t } = useTranslation();
  const { switchPlayerColors, isPlayer0Red, playerNames } = props;

  const handleChangeSide = (eventIgnored: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    switchPlayerColors();
  }

  const playerColors = [isPlayer0Red, !isPlayer0Red];

  const renderColorSetting = () => {
    return playerNames.map((playerName, index) => {
      return (
        <div key={playerName}>
          {playerName}
          <svg height="20" width="20">
            <g>
              <circle
                r="10"
                cx="10"
                cy="10"
                fill={playerColors[index] ? Color.red : Color.orange}
              />
            </g>
          </svg>
        </div>
      )
    })
  };

  return (
    <div>
      <p>{t('katicaBoard.okayWithColors')}</p>
      {renderColorSetting()}
      <button onClick={handleChangeSide}>{t('katicaBoard.switchColors')}</button>
    </div>
  );
}