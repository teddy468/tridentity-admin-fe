import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import zh from './languages/cn.json';
import en from './languages/en.json';
import ja from './languages/jp.json';
import vi from './languages/vi.json';

// const language = localStorage.getItem('language') || 'en'
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    load: 'languageOnly',
    resources: {
      en: { translations: en },
      ja: { translations: ja },
      zh: { translations: zh },
      vi: { translations: vi },
    },
    fallbackLng: 'en',
    defaultNS: 'translations',
    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ',',
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;
