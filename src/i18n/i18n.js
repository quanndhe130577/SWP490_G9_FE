import i18n from "i18next";

import translationEN from "./en.json";
import translationVI from "./vi.json";

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
};

i18n.init({
  resources,
  lng: "vi",
  fallbackLng: "vi", // use en if detected lng is not available

  keySeparator: false, // we do not use keys in form messages.welcome

  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
