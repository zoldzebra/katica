import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';

interface MatchDisplayWrapperProps {
  status: string;
  matchSetup?: JSX.Element;
  board: JSX.Element;
}

export const MatchDisplayWrapper: FC<MatchDisplayWrapperProps> = (props) => {
  const { status, matchSetup, board } = props;

  const renderStatus = (status: string) => {
    if (status === '') {
      return null;
    }
    return (
      <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '16px' }}>
        {status}
      </Typography>
    )
  }

  return (
    <div>
      {renderStatus(status)}
      {matchSetup ? matchSetup : null}
      {board}
    </div>
  );
}