import React, { useEffect, useState } from 'react';

import { LobbyAPI } from 'boardgame.io';
import { LobbyClient } from 'boardgame.io/client';

interface MatchDetailProps {
  match: LobbyAPI.Match,
  userName: string;
  lobbyClient: LobbyClient;
}

export const MatchDetails: React.FC<MatchDetailProps> = (props): JSX.Element => {
  const { match, userName, lobbyClient } = props;
  const [joinedPlayers, setJoinedPlayers] = useState<(string)[]>([]);
  const [emptySeatId, setEmptySeatId] = useState<number | null>(null);

  console.log('match', match);

  useEffect(() => {
    const playersJoined = match.players.reduce((acc, curr) => {
      return curr.name
        ? acc + 1
        : acc;
    }, 0);
    console.log('playersJoined', match.matchID, playersJoined);
    if (playersJoined > 0) {
      match.players.forEach(player => {
        if (!player.name) return;
        setJoinedPlayers(oldPlayers => [...oldPlayers, player.name as string]);
      })
    }
  }, []);

  useEffect(() => {
    const emptySeat = match.players.find(player => !player.name);
    if (!emptySeat) return;
    setEmptySeatId(emptySeat.id);
  }, [])

  const handleJoinMatch = async (match: LobbyAPI.Match, playerID: number) => {
    console.log('match', match)

    if (joinedPlayers.length >= 2) {
      alert("Match is full, can't join");
      return;
    }

    if (joinedPlayers.includes(userName)) {
      alert("Already joined, can't join");
      return;
    }

    try {
      await lobbyClient.joinMatch(
        'katica',
        match.matchID,
        {
          playerID: playerID.toString(),
          playerName: userName,
        }
      )
      setJoinedPlayers(oldPlayers => [...oldPlayers, userName]);
      const newEmptySeatId = emptySeatId === null
        ? 0
        : emptySeatId + 1 >= 2
          ? null
          : emptySeatId + 1;
      setEmptySeatId(newEmptySeatId);
    } catch (error) {
      console.log('Error joining match:', error);
      alert(error.message);
    }
  }

  console.log('emptySeatId', match.matchID, emptySeatId);

  // TODO: think over join/full match logic, it seems overcomplicated now.

  return (
    <div>
      { match.gameName} - { match.matchID}. Players joined: {joinedPlayers}
      {emptySeatId !== null
        ? <button onClick={() => handleJoinMatch(match, emptySeatId)}>Join!</button>
        : null}
    </div>
  );
}