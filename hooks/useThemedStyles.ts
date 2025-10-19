import { useAccessibility } from '../contexts/AccessibilityContext';
import { getTheme } from '../styles/theme';

export function useThemedStyles() {
  const { highContrast, fontSize, getFontSize } = useAccessibility();
  const theme = getTheme(highContrast);
  const fontSizes = getFontSize();

  return {
    theme,
    fontSizes,
    fontSize,
    highContrast,
  };
}