import React, { useEffect, useState, useContext } from 'react';

import { LobbyAPI } from 'boardgame.io';
import { LobbyClient } from 'boardgame.io/client';
import { SocketIO } from "boardgame.io/multiplayer";
import { Client } from "boardgame.io/react";

import { GameServerContext } from '../GameServerProvider/GameServerProvider';

import { TicTacToe } from '../../Games/TicTacToe/Game';
import { TicTacToeBoard } from '../../Games/TicTacToe/Board';


interface MatchDetailProps {
  match: LobbyAPI.Match,
  userName: string;
  lobbyClient: LobbyClient;
}

export const MatchDetails: React.FC<MatchDetailProps> = (props): JSX.Element => {
  const { gameServer } = useContext(GameServerContext);
  const { match, userName, lobbyClient } = props;
  const [joinedPlayers, setJoinedPlayers] = useState<string[]>([]);
  const [userMatchCredentials, setUserMatchCredentials] = useState<string>('');
  const [playerID, setPlayerID] = useState('');
  const [matchOn, setMatchOn] = useState(false);

  console.log('match', match);
  console.log('userMatchCredentials', userMatchCredentials);


  useEffect(() => {
    match.players.forEach(player => {
      if (!player.name) return;
      setJoinedPlayers(oldPlayers => [...oldPlayers, player.name as string]);
    })
  }, []);

  useEffect(() => {
    const localCreds = localStorage.getItem('playerCredentials');
    const localPlayerID = localStorage.getItem('playerID');
    if (localCreds && localPlayerID) {
      setUserMatchCredentials(localCreds);
      setPlayerID(localPlayerID);
    }
  }, []);

  // decide where to persist credentials and playerID for match, state not ok after refresh...

  const isJoinable = (): boolean => {
    return (joinedPlayers.length < match.players.length
      && !joinedPlayers.includes(userName));
  }

  const isStartable = (): boolean => {
    return (joinedPlayers.length === match.players.length
      && joinedPlayers.includes(userName));
  }

  const handleJoinMatch = async (match: LobbyAPI.Match) => {
    const emptySeat = match.players.find(player => !player.name);
    if (!emptySeat) {
      return;
    }

    try {
      const { playerCredentials } = await lobbyClient.joinMatch(
        match.gameName,
        match.matchID,
        {
          playerID: emptySeat.id.toString(),
          playerName: userName,
        }
      )
      setUserMatchCredentials(playerCredentials);
      localStorage.setItem('playerCredentials', playerCredentials);
      setPlayerID(emptySeat.id.toString());
      localStorage.setItem('playerID', emptySeat.id.toString());
      setJoinedPlayers(oldPlayers => [...oldPlayers, userName]);
    } catch (error) {
      console.log('Error joining match:', error);
      alert(error.message);
    }
  }

  const handleStartMatch = () => {
    console.log('start match');
    setMatchOn(true);
  }

  const TicTacToeClient = Client({
    game: TicTacToe,
    numPlayers: 2,
    board: TicTacToeBoard,
    multiplayer: SocketIO({
      server: gameServer,
    }),
  });

  const getTicTacToeClient = () => {
    console.log(`Creating match w playerID ${playerID}, creds: ${userMatchCredentials}`);
    return (
      <TicTacToeClient
        matchID={match.matchID}
        playerID={playerID}
        credentials={userMatchCredentials}
      />
    );
  };

  return (
    <div>
      {match.gameName} - {match.matchID}. Players joined:
      <ul>
        {joinedPlayers.map(player => <li key={player}>{player}</li>)}
      </ul>
      {isJoinable()
        ? <button onClick={() => handleJoinMatch(match)}>Join!</button>
        : null}
      {isStartable()
        ? <button onClick={handleStartMatch}>Start match!</button>
        : null}
      {matchOn
        ? getTicTacToeClient()
        : null}
    </div>
  );
}