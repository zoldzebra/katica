import React from "react";
import { useTranslation } from 'react-i18next';

export const ChangeLanguage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => i18n.changeLanguage(language);

  return (
    <>
      <p>{t('lobby.changeLanguage')}</p>
      <button onClick={() => changeLanguage("en")}>{t('lobby.english')}</button>
      <button onClick={() => changeLanguage("hu")}>{t('lobby.hungarian')}</button>
    </>
  )
}