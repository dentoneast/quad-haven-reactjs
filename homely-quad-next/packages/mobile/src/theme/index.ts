import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    secondary: '#6C757D',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#333333',
    textSecondary: '#6C757D',
    border: '#E9ECEF',
    error: '#FF3B30',
    warning: '#FF9500',
    success: '#34C759',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
};
