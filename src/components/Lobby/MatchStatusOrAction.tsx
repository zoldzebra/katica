import React from 'react';
import { useHistory } from 'react-router-dom';

interface MatchStatusOrActionProps {
  joinedPlayers: string[];
  maxPlayers: number;
  userName: string;
  handleJoinMatch: () => Promise<void>;
  handleLeaveMatch: () => Promise<void>;
  matchID: string;
}

export const MatchStatusOrAction: React.FC<MatchStatusOrActionProps> = (props): JSX.Element => {
  const history = useHistory();
  const {
    joinedPlayers,
    maxPlayers,
    userName,
    handleJoinMatch,
    handleLeaveMatch,
    matchID
  } = props;

  const isFull = (): boolean => joinedPlayers.length === maxPlayers;

  const isJoined = (): boolean => joinedPlayers.includes(userName);

  if (isFull() && isJoined()) {
    return (
      <>
        <button onClick={() => history.push(`/match/${matchID}`)}>Play match!</button>
        <button onClick={() => handleLeaveMatch()}>Leave match!</button>
      </>
    )
  }

  if (isFull() && !isJoined()) {
    return (
      <p>
        Match is full.
      </p>
    )
  }

  if (isJoined()) {
    return (
      <>
        <p>Waiting for others to join...</p>
        <button onClick={() => handleLeaveMatch()}>Leave match!</button>
      </>
    )
  }

  return (
    <button onClick={() => handleJoinMatch()}>Join!</button>
  )
}