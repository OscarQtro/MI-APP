import { useAccessibility } from '../contexts/AccessibilityContext';
import { getTheme } from '../styles/theme';

export function useThemedStyles() {
  const { 
    highContrast, 
    colorBlindMode, 
    darkMode,
    fontSize, 
    screenReaderEnabled,
    getFontSize, 
    speakText, 
    speakNavigation, 
    speakAction 
  } = useAccessibility();
  const theme = getTheme(highContrast, colorBlindMode, darkMode);
  const fontSizes = getFontSize();

  return {
    theme,
    fontSizes,
    fontSize,
    highContrast,
    colorBlindMode,
    darkMode,
    screenReaderEnabled,
    speakText,
    speakNavigation,
    speakAction,
  };
}