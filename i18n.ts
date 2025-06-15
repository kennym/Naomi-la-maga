import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Import all the translations
import en from './translations/en.json';
import es from './translations/es.json';
import fr from './translations/fr.json';

const i18n = new I18n();

// Set the key-value pairs for the different languages you want to support
i18n.translations = {
  en,
  es,
  fr,
};

// Set the locale once at the beginning of your app.
const locales = Localization.getLocales();
if (locales.length > 0 && locales[0].languageCode) {
  i18n.locale = locales[0].languageCode;
} else {
    i18n.locale = 'en'; // Default to English if locale is not found
}

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.enableFallback = true;
// To see the fallback mechanism in action, you can remove a key from one of the translation files.

export default i18n; 