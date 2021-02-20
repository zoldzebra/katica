import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import i18n from '../../i18n/config';

const useStyles = makeStyles({
  selected: {
    fontWeight: 'bold',
  },
  notSelected: {
    fontWeight: 'normal',
  }
})

interface LanguageInfo {
  code: string,
  name: string,
}

interface LanguageList {
  [key: string]: LanguageInfo;
}

const LANGUAGES: LanguageList = {
  hungarian: {
    code: 'hu',
    name: i18n.t('changeLanguage.hungarian'),
  },
  english: {
    code: 'en',
    name: i18n.t('changeLanguage.english'),
  },
}

export const ChangeLanguage: React.FC = () => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const [actualLanguage, setActualLanguage] = useState<string>(LANGUAGES.hungarian.code);

  useEffect(() => {
    const actualLanguage = i18n.language;
    setActualLanguage(actualLanguage);
  }, [i18n.language]);

  const changeLanguage = (language: string) => i18n.changeLanguage(language);

  const renderLanguageButtonWithSelectionState = (languageInfo: LanguageInfo) => {
    let className = classes.notSelected;
    if (actualLanguage === languageInfo.code) {
      className = classes.selected;
    }
    return (
      <button className={className} onClick={() => changeLanguage(languageInfo.code)}>{languageInfo.name}</button>
    )
  }

  return (
    <>
      <p>{t('changeLanguage.changeLanguage')}</p>
      {renderLanguageButtonWithSelectionState(LANGUAGES.hungarian)}
      {renderLanguageButtonWithSelectionState(LANGUAGES.english)}
    </>
  )
}