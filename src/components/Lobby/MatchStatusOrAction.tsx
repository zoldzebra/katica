import React from 'react';
import { useTranslation } from 'react-i18next';

interface MatchStatusOrActionProps {
  joinedPlayers: string[];
  maxPlayers: number;
  userName: string;
  handleJoinMatch: () => Promise<void>;
  handleLeaveMatch: () => Promise<void>;
  handlePlayMatch: () => void;
}

export const MatchStatusOrAction: React.FC<MatchStatusOrActionProps> = (props): JSX.Element => {
  const {
    joinedPlayers,
    maxPlayers,
    userName,
    handleJoinMatch,
    handleLeaveMatch,
    handlePlayMatch,
  } = props;
  const { t } = useTranslation();

  const isFull = (): boolean => joinedPlayers.length === maxPlayers;

  const isJoined = (): boolean => joinedPlayers.includes(userName);

  if (isFull() && isJoined()) {
    return (
      <>
        <button onClick={handlePlayMatch}>{t('matchStatus.playMatch')}</button>
        <button onClick={handleLeaveMatch}>{t('matchStatus.leaveMatch')}</button>
      </>
    )
  }

  if (isFull() && !isJoined()) {
    return (
      <p>
        {t('matchStatus.matchIsFull')}
      </p>
    )
  }

  if (isJoined()) {
    return (
      <>
        <p>{t('matchStatus.waitingOthersToJoin')}</p>
        <button onClick={handleLeaveMatch}>{t('matchStatus.leaveMatch')}</button>
      </>
    )
  }

  return (
    <button onClick={handleJoinMatch}>{t('matchStatus.joinMatch')}</button>
  )
}