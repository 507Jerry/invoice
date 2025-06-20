import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import zh from './locales/zh.json';

const resources = {
  en: {
    translation: en.translation,
  },
  zh: {
    translation: zh.translation,
  },
};

i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 将 i18n 实例传递给 react-i18next
  .use(initReactI18next)
  // 初始化 i18next
  .init({
    resources,
    fallbackLng: 'zh', // 如果检测不到语言，则使用中文
    debug: true, // 在开发环境中开启调试
    interpolation: {
      escapeValue: false, // react已经处理了XSS
    },
  });

export default i18n; 