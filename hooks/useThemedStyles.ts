import { useAccessibility } from '../contexts/AccessibilityContext';
import { getTheme } from '../styles/theme';

export function useThemedStyles() {
  const { 
    highContrast, 
    colorBlindMode, 
    fontSize, 
    screenReaderEnabled,
    getFontSize, 
    speakText, 
    speakNavigation, 
    speakAction 
  } = useAccessibility();
  const theme = getTheme(highContrast, colorBlindMode);
  const fontSizes = getFontSize();

  return {
    theme,
    fontSizes,
    fontSize,
    highContrast,
    colorBlindMode,
    screenReaderEnabled,
    speakText,
    speakNavigation,
    speakAction,
  };
}