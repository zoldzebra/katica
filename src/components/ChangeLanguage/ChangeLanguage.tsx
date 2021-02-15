import React, { useEffect } from "react";
import { useTranslation } from 'react-i18next';

export const ChangeLanguage: React.FC = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    let otherLanguage = '';
    const actualLanguage = i18n.language;
    if (actualLanguage === 'hu') {
      otherLanguage = 'en';
    } else {
      otherLanguage = 'hu';
    }
    const activeLanguageButton = document.getElementById(actualLanguage);
    const otherLanguageButton = document.getElementById(otherLanguage);
    if (!activeLanguageButton || !otherLanguageButton) {
      return;
    }
    activeLanguageButton.style.fontWeight = 'bold';
    otherLanguageButton.style.fontWeight = 'normal';
  }, [i18n.language]);

  const changeLanguage = (language: string) => i18n.changeLanguage(language);

  return (
    <>
      <p>{t('lobby.changeLanguage')}</p>
      <button id='en' onClick={() => changeLanguage('en')}>{t('lobby.english')}</button>
      <button id='hu' onClick={() => changeLanguage('hu')}>{t('lobby.hungarian')}</button>
    </>
  )
}