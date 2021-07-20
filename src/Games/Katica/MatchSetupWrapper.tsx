import React, { FC } from 'react';

interface MatchSetupWrapperProps {
  children?: JSX.Element;
  signAgreement: (eventIgnored: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const MatchSetupWrapper: FC<MatchSetupWrapperProps> = (props) => {
  const { children, signAgreement } = props;

  return (
    <div>
      {children}
      <button onClick={signAgreement}>OK for me!</button>
    </div>
  );
}