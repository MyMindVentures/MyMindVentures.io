import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

/**
 * i18n Configuration
 * 
 * Sets up internationalization for the application using i18next.
 * Supports multiple languages with fallback and dynamic language switching.
 */

// Supported languages
export const SUPPORTED_LANGUAGES = {
  nl: {
    name: 'Nederlands',
    flag: '🇳🇱',
    direction: 'ltr'
  },
  en: {
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  },
  de: {
    name: 'Deutsch',
    flag: '🇩🇪',
    direction: 'ltr'
  },
  fr: {
    name: 'Français',
    flag: '🇫🇷',
    direction: 'ltr'
  },
  es: {
    name: 'Español',
    flag: '🇪🇸',
    direction: 'ltr'
  }
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Default language
export const DEFAULT_LANGUAGE: SupportedLanguage = 'nl';

// i18next configuration
const i18nConfig = {
  // Debug mode (set to false in production)
  debug: process.env.NODE_ENV === 'development',
  
  // Fallback language
  fallbackLng: DEFAULT_LANGUAGE,
  
  // Supported languages
  supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
  
  // Interpolation options
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  
  // Detection options
  detection: {
    // Order of language detection
    order: ['localStorage', 'navigator', 'htmlTag'],
    
    // Keys to store language preference
    lookupLocalStorage: 'i18nextLng',
    lookupSessionStorage: 'i18nextLng',
    
    // Cache user language
    caches: ['localStorage', 'sessionStorage'],
    
    // Don't cache language
    excludeCacheFor: ['cimode'],
    
    // Convert to lowercase
    convertDetectedLanguage: (lng: string) => lng.toLowerCase(),
  },
  
  // React integration
  react: {
    useSuspense: false, // Disable Suspense for better error handling
  },
  
  // Namespace handling
  defaultNS: 'common',
  ns: ['common', 'auth', 'dashboard', 'errors', 'validation'],
  
  // Backend options (if using backend)
  backend: {
    // Load path for translation files
    loadPath: '/locales/{{lng}}/{{ns}}.json',
    
    // Add path for missing translations
    addPath: '/locales/{{lng}}/{{ns}}.json',
    
    // Parse JSON response
    parse: (data: string) => JSON.parse(data),
    
    // Stringify data for add
    stringify: (data: any) => JSON.stringify(data, null, 2),
  },
  
  // Language change handling
  languageChanged: (lng: string) => {
    // Update document direction
    const direction = SUPPORTED_LANGUAGES[lng as SupportedLanguage]?.direction || 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = lng;
    
    // Store language preference
    localStorage.setItem('i18nextLng', lng);
    
    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lng } }));
  },
  
  // Missing key handling
  saveMissing: true,
  saveMissingTo: 'all',
  
  // Key separator
  keySeparator: '.',
  
  // Nested key separator
  nestedSeparator: '_',
  
  // Plural separator
  pluralSeparator: '_',
  
  // Context separator
  contextSeparator: '_',
};

// Initialize i18next
export const initializeI18n = async (): Promise<void> => {
  try {
    await i18next
      .use(LanguageDetector)
      .use(initReactI18next)
      .init(i18nConfig);
    
    console.log('i18n initialized successfully');
    console.log('Current language:', i18next.language);
    console.log('Supported languages:', i18next.languages);
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
    throw error;
  }
};

// Language utilities
export const getCurrentLanguage = (): SupportedLanguage => {
  return (i18next.language as SupportedLanguage) || DEFAULT_LANGUAGE;
};

export const setLanguage = async (language: SupportedLanguage): Promise<void> => {
  if (!SUPPORTED_LANGUAGES[language]) {
    throw new Error(`Unsupported language: ${language}`);
  }
  
  await i18next.changeLanguage(language);
};

export const getLanguageInfo = (language: SupportedLanguage) => {
  return SUPPORTED_LANGUAGES[language];
};

export const isRTL = (language: SupportedLanguage): boolean => {
  return SUPPORTED_LANGUAGES[language]?.direction === 'rtl';
};

// Export i18next instance
export default i18next;
