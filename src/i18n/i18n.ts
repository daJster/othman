import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import arCommon from './locales/ar/common.json';

export const LANGUAGES = [
    { code: "ar", label: "عربية" },
    { code: "en", label: "English" },
];
const DEFAULT_LANG = 'ar';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { common: enCommon },
            ar: { common: arCommon },
        },
        lng: DEFAULT_LANG,
        fallbackLng: DEFAULT_LANG, //
        ns: ['common'],
        defaultNS: 'common',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

// Listen for language changes to update the document direction (RTL/LTR)
i18n.on('languageChanged', (lng) => {
    const dir = lng === DEFAULT_LANG ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lng;
});

export default i18n;
