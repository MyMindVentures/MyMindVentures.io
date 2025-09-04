import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  SupportedLanguage, 
  SUPPORTED_LANGUAGES, 
  DEFAULT_LANGUAGE,
  setLanguage as setI18nLanguage,
  getCurrentLanguage,
  getLanguageInfo,
  isRTL
} from './config';

/**
 * Language Context Interface
 */
interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  getLanguageInfo: (language: SupportedLanguage) => any;
  isRTL: boolean;
  isLoading: boolean;
}

/**
 * Language Context
 */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Language Provider Props
 */
interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: SupportedLanguage;
}

/**
 * Language Provider Component
 * 
 * Provides language context and functionality to the entire application.
 * Handles language switching, RTL support, and language persistence.
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  defaultLanguage = DEFAULT_LANGUAGE 
}) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(defaultLanguage);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        setIsLoading(true);
        
        // Get stored language or use default
        const storedLanguage = localStorage.getItem('i18nextLng') as SupportedLanguage;
        const language = storedLanguage && SUPPORTED_LANGUAGES[storedLanguage] 
          ? storedLanguage 
          : defaultLanguage;
        
        // Set language if different from current
        if (language !== i18n.language) {
          await i18n.changeLanguage(language);
        }
        
        setCurrentLanguage(language);
        
        // Update document attributes
        updateDocumentAttributes(language);
        
      } catch (error) {
        console.error('Failed to initialize language:', error);
        // Fallback to default language
        setCurrentLanguage(defaultLanguage);
        updateDocumentAttributes(defaultLanguage);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, [defaultLanguage, i18n]);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const newLanguage = event.detail.language as SupportedLanguage;
      setCurrentLanguage(newLanguage);
      updateDocumentAttributes(newLanguage);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  // Update document attributes when language changes
  const updateDocumentAttributes = (language: SupportedLanguage) => {
    const languageInfo = getLanguageInfo(language);
    
    // Update document language
    document.documentElement.lang = language;
    
    // Update document direction
    document.documentElement.dir = languageInfo.direction;
    
    // Update document title if available
    if (document.title) {
      const titleKey = `meta.title.${language}`;
      const translatedTitle = i18n.t(titleKey, { defaultValue: document.title });
      if (translatedTitle !== titleKey) {
        document.title = translatedTitle;
      }
    }
  };

  // Change language function
  const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
    try {
      if (!SUPPORTED_LANGUAGES[language]) {
        throw new Error(`Unsupported language: ${language}`);
      }

      setIsLoading(true);
      
      // Change i18n language
      await setI18nLanguage(language);
      
      // Update current language
      setCurrentLanguage(language);
      
      // Update document attributes
      updateDocumentAttributes(language);
      
      // Store language preference
      localStorage.setItem('i18nextLng', language);
      
      console.log(`Language changed to: ${language}`);
      
    } catch (error) {
      console.error('Failed to change language:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const contextValue: LanguageContextType = {
    currentLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    changeLanguage,
    getLanguageInfo,
    isRTL: isRTL(currentLanguage),
    isLoading
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to use language context
 * @returns Language context
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

/**
 * Hook to get current language info
 * @returns Current language info
 */
export const useCurrentLanguageInfo = () => {
  const { currentLanguage, getLanguageInfo } = useLanguage();
  return getLanguageInfo(currentLanguage);
};

/**
 * Hook to check if current language is RTL
 * @returns True if current language is RTL
 */
export const useIsRTL = (): boolean => {
  const { isRTL } = useLanguage();
  return isRTL;
};

export default LanguageProvider;
