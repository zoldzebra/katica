import React, { FC } from 'react';

import { Color } from './Board';

interface ColorSelectorProps {
  signAgreement: (eventIgnored: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isPlayer0Red: boolean;
  playerNames: string[];
}

export const ColorSelector: FC<ColorSelectorProps> = (props) => {
  const { signAgreement, isPlayer0Red, playerNames } = props;

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setMatchType(event.target.checked);
  // };

  const isPlayerWithRedColor = (playerId: number, isPlayer0Red: boolean) => {
    const isRed = (playerId === 0 && isPlayer0Red)
      || (playerId === 1 && !isPlayer0Red);

    return isRed;
  }


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
                fill={isPlayerWithRedColor(index, isPlayer0Red) ? Color.red : Color.orange}
              />
            </g>
          </svg>
        </div>
      )
    })
  };

  return (
    <div>
      <p>Choose color!</p>
      {renderColorSetting()}
      <button onClick={signAgreement}>OK for me!</button>
    </div>
  );
}