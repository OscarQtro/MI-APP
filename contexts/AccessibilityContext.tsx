import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as Speech from 'expo-speech';

export type FontSize = 'small' | 'normal' | 'large';

interface AccessibilityContextType {
  highContrast: boolean;
  colorBlindMode: boolean;
  fontSize: FontSize;
  screenReaderEnabled: boolean;
  setHighContrast: (value: boolean) => void;
  setColorBlindMode: (value: boolean) => void;
  setFontSize: (size: FontSize) => void;
  setScreenReaderEnabled: (value: boolean) => void;
  speakText: (text: string) => void;
  getFontSize: () => {
    base: number;
    title: number;
    subtitle: number;
    caption: number;
  };
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [highContrast, setHighContrast] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  const speakText = (text: string) => {
    if (screenReaderEnabled) {
      try {
        Speech.speak(text, {
          language: 'es-MX',
          pitch: 1.0,
          rate: 0.8,
        });
      } catch (error) {
        console.warn('Error al reproducir texto:', error);
      }
    }
  };

  const getFontSize = () => {
    const multiplier = fontSize === 'small' ? 0.8 : fontSize === 'large' ? 1.3 : 1.0;
    return {
      base: 16 * multiplier,
      title: 24 * multiplier,
      subtitle: 18 * multiplier,
      caption: 14 * multiplier,
    };
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        colorBlindMode,
        fontSize,
        screenReaderEnabled,
        setHighContrast,
        setColorBlindMode,
        setFontSize,
        setScreenReaderEnabled,
        speakText,
        getFontSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}