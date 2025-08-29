// Theme constants for consistent styling across the app
export const Colors = {
  // Primary brand colors
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4DA3FF',
  
  // Secondary colors
  secondary: '#5856D6',
  secondaryLight: '#8E8DFF',
  
  // Status colors
  success: '#34C759',
  successLight: '#85E085',
  warning: '#FF9500',
  warningLight: '#FFB84D',
  error: '#FF3B30',
  errorLight: '#FF7A73',
  
  // Attendance specific colors
  present: '#34C759',
  absent: '#FF3B30',
  holiday: '#007AFF',
  today: '#FF9500',
  
  // Neutral colors
  background: '#F8F9FA',
  backgroundSecondary: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F3F4',
  
  // Text colors
  textPrimary: '#1D1D1F',
  textSecondary: '#6D6D80',
  textTertiary: '#8E8E93',
  textOnDark: '#FFFFFF',
  textOnPrimary: '#FFFFFF',
  
  // Border colors
  border: '#D1D1D6',
  borderLight: '#E5E5EA',
  borderDark: '#C7C7CC',
  
  // Shadow colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
  
  // Special colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  highlight: 'rgba(0, 122, 255, 0.1)',
};

export const Typography = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
};

export const BorderRadius = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Layout = {
  // Screen padding
  screenPadding: Spacing.base,
  screenPaddingHorizontal: Spacing.base,
  screenPaddingVertical: Spacing.lg,
  
  // Component spacing
  componentSpacing: Spacing.md,
  sectionSpacing: Spacing.xl,
  
  // Button heights
  buttonHeight: {
    sm: 36,
    base: 44,
    lg: 52,
  },
  
  // Input heights
  inputHeight: {
    sm: 36,
    base: 44,
    lg: 52,
  },
};
