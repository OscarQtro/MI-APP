export const normalTheme = {
  colors: {
    gradTop: '#00B4D8',
    gradBottom: '#FFEB85',
    primary: '#00AEEF',
    secondary: '#FFEB85',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    textPrimary: '#1B1B1B',
    textSecondary: '#2B2B2B',
    textLight: '#FFFFFF',
    textMuted: '#6C757D',
    trunk: '#7B4A2E',
    leaf1: '#82D173',
    leaf2: '#6CC069',
    glow: 'rgba(255,255,255,0.35)',
    border: '#E9ECEF',
    shadow: 'rgba(0,0,0,0.1)',
    // Estados
    success: '#28A745',
    warning: '#FFC107',
    danger: '#DC3545',
    info: '#17A2B8',
  },
};

export const highContrastTheme = {
  colors: {
    gradTop: '#000000',
    gradBottom: '#FFFFFF',
    primary: '#0000FF',
    secondary: '#FFFF00',
    background: '#FFFFFF',
    surface: '#F0F0F0',
    textPrimary: '#000000',
    textSecondary: '#000000',
    textLight: '#FFFFFF',
    textMuted: '#000000',
    trunk: '#000000',
    leaf1: '#000000',
    leaf2: '#000000',
    glow: 'rgba(0,0,0,0.5)',
    border: '#000000',
    shadow: 'rgba(0,0,0,0.8)',
    // Estados con alto contraste
    success: '#006600',
    warning: '#CC6600',
    danger: '#CC0000',
    info: '#000099',
  },
};

export const getTheme = (highContrast: boolean) => {
  return highContrast ? highContrastTheme : normalTheme;
};
