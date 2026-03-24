import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import your translation files (we will create these next)
import enCommon from './locales/en/common.json';
import arCommon from './locales/ar/common.json';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { common: enCommon },
            ar: { common: arCommon },
        },
        fallbackLng: 'en',
        ns: ['common'],
        defaultNS: 'common',
        interpolation: {
            escapeValue: false, // React already safes from xss
        },
    });

// Listen for language changes to update the document direction (RTL/LTR)
i18n.on('languageChanged', (lng) => {
    const dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lng;
});

export default i18n;
