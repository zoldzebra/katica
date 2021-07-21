import React, { FC } from 'react';
import { Paper, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface MatchSetupWrapperProps {
  children?: JSX.Element;
  signAgreement: (eventIgnored: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const MatchSetupWrapper: FC<MatchSetupWrapperProps> = (props) => {
  const { t } = useTranslation();
  const { children, signAgreement } = props;

  if (!children) {
    return null;
  }

  return (
    <Paper elevation={3} style={{ width: '40%', margin: '0 auto' }}>
      <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '16px' }}>
        {t('katicaBoard.matchSetup')}
      </Typography>
      {children}
      <button onClick={signAgreement} style={{ marginTop: '16px' }}>{t('katicaBoard.okayForMe')}</button>
    </Paper>
  );
}