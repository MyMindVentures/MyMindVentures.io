import { useTranslation as useI18nTranslation, TFunction } from 'react-i18next';
import { useLanguage } from './LanguageProvider';
import { SupportedLanguage } from './config';

/**
 * Extended Translation Hook
 * 
 * Provides enhanced translation functionality with language context integration,
 * type safety, and additional utility functions.
 */

/**
 * Extended translation hook return type
 */
interface ExtendedTranslationReturn {
  t: TFunction;
  i18n: any;
  ready: boolean;
  currentLanguage: SupportedLanguage;
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  isRTL: boolean;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string, options?: Intl.NumberFormatOptions) => string;
  formatRelativeTime: (date: Date, now?: Date) => string;
  getPlural: (key: string, count: number, options?: any) => string;
  interpolate: (key: string, values: Record<string, any>) => string;
}

/**
 * Custom useTranslation hook
 * @param ns - Namespace(s) to use
 * @returns Extended translation object
 */
export const useTranslation = (ns?: string | string[]): ExtendedTranslationReturn => {
  const { t, i18n, ready } = useI18nTranslation(ns);
  const { currentLanguage, changeLanguage, isRTL } = useLanguage();

  /**
   * Format date according to current language
   * @param date - Date to format
   * @param options - DateTimeFormat options
   * @returns Formatted date string
   */
  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };

    try {
      return new Intl.DateTimeFormat(currentLanguage, defaultOptions).format(date);
    } catch (error) {
      console.warn('Failed to format date with current language, falling back to default:', error);
      return date.toLocaleDateString();
    }
  };

  /**
   * Format number according to current language
   * @param number - Number to format
   * @param options - NumberFormat options
   * @returns Formatted number string
   */
  const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
    const defaultOptions: Intl.NumberFormatOptions = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...options
    };

    try {
      return new Intl.NumberFormat(currentLanguage, defaultOptions).format(number);
    } catch (error) {
      console.warn('Failed to format number with current language, falling back to default:', error);
      return number.toLocaleString();
    }
  };

  /**
   * Format currency according to current language
   * @param amount - Amount to format
   * @param currency - Currency code (defaults to EUR)
   * @param options - NumberFormat options
   * @returns Formatted currency string
   */
  const formatCurrency = (
    amount: number, 
    currency: string = 'EUR', 
    options?: Intl.NumberFormatOptions
  ): string => {
    const defaultOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options
    };

    try {
      return new Intl.NumberFormat(currentLanguage, defaultOptions).format(amount);
    } catch (error) {
      console.warn('Failed to format currency with current language, falling back to default:', error);
      return new Intl.NumberFormat('en-US', defaultOptions).format(amount);
    }
  };

  /**
   * Format relative time (e.g., "2 hours ago", "in 3 days")
   * @param date - Date to format
   * @param now - Current date (defaults to now)
   * @returns Formatted relative time string
   */
  const formatRelativeTime = (date: Date, now: Date = new Date()): string => {
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    try {
      const rtf = new Intl.RelativeTimeFormat(currentLanguage, { numeric: 'auto' });
      
      if (diffInDays > 0) {
        return rtf.format(-diffInDays, 'day');
      } else if (diffInHours > 0) {
        return rtf.format(-diffInHours, 'hour');
      } else if (diffInMinutes > 0) {
        return rtf.format(-diffInMinutes, 'minute');
      } else {
        return rtf.format(-diffInSeconds, 'second');
      }
    } catch (error) {
      console.warn('Failed to format relative time with current language, falling back to default:', error);
      
      // Fallback implementation
      if (diffInDays > 0) {
        return `${diffInDays} days ago`;
      } else if (diffInHours > 0) {
        return `${diffInHours} hours ago`;
      } else if (diffInMinutes > 0) {
        return `${diffInMinutes} minutes ago`;
      } else {
        return 'Just now';
      }
    }
  };

  /**
   * Get plural form of a translation key
   * @param key - Translation key
   * @param count - Count for pluralization
   * @param options - Additional options
   * @returns Pluralized translation
   */
  const getPlural = (key: string, count: number, options?: any): string => {
    try {
      return t(key, { count, ...options });
    } catch (error) {
      console.warn('Failed to get plural translation:', error);
      return t(key, { defaultValue: key, count, ...options });
    }
  };

  /**
   * Interpolate translation with values
   * @param key - Translation key
   * @param values - Values to interpolate
   * @returns Interpolated translation
   */
  const interpolate = (key: string, values: Record<string, any>): string => {
    try {
      return t(key, values);
    } catch (error) {
      console.warn('Failed to interpolate translation:', error);
      return t(key, { defaultValue: key, ...values });
    }
  };

  return {
    t,
    i18n,
    ready,
    currentLanguage,
    changeLanguage,
    isRTL,
    formatDate,
    formatNumber,
    formatCurrency,
    formatRelativeTime,
    getPlural,
    interpolate
  };
};

/**
 * Hook for common translations
 * @returns Common translation function
 */
export const useCommonTranslation = () => {
  return useTranslation('common');
};

/**
 * Hook for authentication translations
 * @returns Auth translation function
 */
export const useAuthTranslation = () => {
  return useTranslation('auth');
};

/**
 * Hook for dashboard translations
 * @returns Dashboard translation function
 */
export const useDashboardTranslation = () => {
  return useTranslation('dashboard');
};

/**
 * Hook for error translations
 * @returns Error translation function
 */
export const useErrorTranslation = () => {
  return useTranslation('errors');
};

/**
 * Hook for validation translations
 * @returns Validation translation function
 */
export const useValidationTranslation = () => {
  return useTranslation('validation');
};

export default useTranslation;
