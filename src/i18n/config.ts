import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en } from '../i18n/locales/en';
import { hu } from '../i18n/locales/hu';

const resources = {
  hu: {
    translation: hu,
  },
  en: {
    translation: en,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'hu',
    fallbackLng: 'en',
    load: 'currentOnly',
    react: {
      useSuspense: true,
      wait: true,
    },
  });

export default i18n;