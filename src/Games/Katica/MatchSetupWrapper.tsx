import React, { FC } from 'react';

interface MatchSetupWrapperProps {
  children: JSX.Element;
  playerNames: string[];
  playerAgreement: boolean[];
  signAgreement: (eventIgnored: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const MatchSetupWrapper: FC<MatchSetupWrapperProps> = (props) => {
  const { children, playerNames, playerAgreement, signAgreement } = props;

  const renderAgreement = (agreement: boolean) => {
    return (
      <>
        {agreement ? 'Lets go!' : 'Let me see...'}
      </>
    )
  }

  const renderAgreementStatus = () => {
    return (
      <div>
        <p>{playerNames[0]}: {renderAgreement(playerAgreement[0])}</p>
        <p>{playerNames[1]}: {renderAgreement(playerAgreement[1])}</p>
      </div>
    )
  }


  return (
    <div>
      {children}
      {renderAgreementStatus()}
      <button onClick={signAgreement}>OK for me!</button>
    </div>
  );
}