import React, { useState, useEffect, useContext, MouseEvent } from 'react';
import { Paper } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import * as R from 'ramda';
import { useTranslation } from 'react-i18next';

import { LobbyAPI } from 'boardgame.io';

import { getUserInfo, signOutUser, UserInfo } from '../../Services/userService';
import { AuthContext } from '../AuthProvider/AuthProvider';
import { GameServerContext } from '../GameServerProvider/GameServerProvider';
import { MatchList } from './MatchList';
import { ChangeLanguage } from '../ChangeLanguage/ChangeLanguage';
import { getObjectFromLocalStorage, USER_MATCH_CREDENTIALS } from '../../utils/localStorageHelper';
import { useInterval } from '../../utils/useInterval';

export const Lobby = (): JSX.Element => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { lobbyClient } = useContext(GameServerContext);
  const history = useHistory();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [gameNames, setGameNames] = useState<string[]>([]);
  const [matches, setMatches] = useState<LobbyAPI.Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) {
        setUserInfo(null)
        return;
      }
      const actualUserInfo = await getUserInfo(user);
      setUserInfo(actualUserInfo);
    }
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchGameNames = async (): Promise<void> => {
      const gameNameList = await lobbyClient.listGames();
      setGameNames(gameNameList);
    }
    fetchGameNames();
  }, []);

  useInterval(() => {
    const updateMatchList = async () => {
      const allMatches = await getAllMatches();
      setLoadingMatches(false);
      if (R.equals(allMatches, matches)) return;
      setMatches(allMatches);
    };
    updateMatchList();
  }, 1000);

  useEffect(() => {
    if (matches.length === 0) {
      return;
    }
    const syncLocalStorageWithMatches = () => {
      const storedMatchCredentials = getObjectFromLocalStorage(USER_MATCH_CREDENTIALS);
      if (!storedMatchCredentials) return;
      const storedMatchIds = Object.keys(storedMatchCredentials);
      const syncedMatchCredentials: Record<string, unknown> = {};

      const matchIds = matches.map(match => match.matchID)
      storedMatchIds.forEach(storedMatchId => {
        if (matchIds.includes(storedMatchId)) {
          syncedMatchCredentials[storedMatchId] = storedMatchCredentials[storedMatchId];
        }
      })
      localStorage.setItem(USER_MATCH_CREDENTIALS, JSON.stringify(syncedMatchCredentials));
    }
    syncLocalStorageWithMatches();
  }, [matches]);

  const getAllMatches = async (): Promise<LobbyAPI.Match[]> => {
    const promises = gameNames.map((gameName) => lobbyClient.listMatches(gameName));
    const allMatchLists = await Promise.all(promises);
    const allMatches: LobbyAPI.Match[] = [];
    allMatchLists.forEach(matchList => allMatches.push(...matchList.matches));
    allMatches.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1);
    return allMatches;
  }

  const handleLogoutClick = async (event: MouseEvent) => {
    event.preventDefault();
    await signOutUser();
    history.push("/auth/login");
  }

  const handleCreateNewMatch = async (gameName: string) => {
    const newMatchID = await lobbyClient.createMatch(gameName, {
      numPlayers: 2
    });
    await lobbyClient.getMatch(gameName, newMatchID.matchID);
  }

  const renderLoadingOrMatchList = () => {
    if (loadingMatches) {
      return (
        <p>Loading matches</p>
      );
    }
    return (
      <MatchList
        matches={matches}
        userName={userName}
      />
    )
  }

  const userName = userInfo?.userName ?? '-';
  const email = userInfo?.email ?? '-';

  return (
    <Paper>
      <p>{t('lobby.userName')}: {userName}, {t('lobby.email')}: {email}</p>
      <button onClick={handleLogoutClick}>{t('lobby.logout')}</button>
      <ChangeLanguage />
      <h1>{t('lobby.lobbyTitle')}</h1>
      <p>{t('lobby.welcomeMessage')}</p>
      <p><i>{t('lobby.explanation')}</i></p>
      <p><i>{t('lobby.devContact')}</i></p>
      <p>{t('lobby.availableGames')}</p>
      <ul>
        {gameNames.map((gameName) => {
          return (
            <li key={gameName}>{gameName}
              <button onClick={() => handleCreateNewMatch(gameName)}>
                {t('lobby.createNewMatch')}
              </button>
            </li>
          )
        })
        }
      </ul>
      {renderLoadingOrMatchList()}
    </Paper>
  );
}