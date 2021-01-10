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

  console.log('match', match);

  useEffect(() => {
    match.players.forEach(player => {
      if (!player.name) return;
      setJoinedPlayers(oldPlayers => [...oldPlayers, player.name as string]);
    })
  }, []);

  const isJoinable = (): boolean => {
    return (joinedPlayers.length < match.players.length
      && !joinedPlayers.includes(userName))
  }

  const handleJoinMatch = async (match: LobbyAPI.Match) => {
    const emptySeat = match.players.find(player => !player.name);
    if (!emptySeat) {
      return;
    }

    try {
      await lobbyClient.joinMatch(
        match.gameName,
        match.matchID,
        {
          playerID: emptySeat.id.toString(),
          playerName: userName,
        }
      )
      setJoinedPlayers(oldPlayers => [...oldPlayers, userName]);
    } catch (error) {
      console.log('Error joining match:', error);
      alert(error.message);
    }
  }

  return (
    <div>
      { match.gameName} - { match.matchID}. Players joined: {joinedPlayers}
      {isJoinable()
        ? <button onClick={() => handleJoinMatch(match)}>Join!</button>
        : null}
    </div>
  );
}