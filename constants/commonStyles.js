import { StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Layout } from './theme';

export const CommonStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Layout.screenPaddingVertical,
  },
  
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.base,
  },
  
  // Header styles
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    ...Shadows.sm,
  },
  
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },

  // Card styles
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginVertical: Spacing.xs,
    ...Shadows.base,
  },
  
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: Spacing.sm,
    marginBottom: Spacing.base,
  },
  
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  
  cardSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  
  // Button styles
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: Layout.buttonHeight.base,
    ...Shadows.base,
  },
  
  buttonSecondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  
  buttonSuccess: {
    backgroundColor: Colors.success,
  },
  
  buttonWarning: {
    backgroundColor: Colors.warning,
  },
  
  buttonError: {
    backgroundColor: Colors.error,
  },
  
  buttonSmall: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    height: Layout.buttonHeight.sm,
    minWidth: 60,
  },
  
  buttonLarge: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.base,
    height: Layout.buttonHeight.lg,
  },
  
  buttonText: {
    color: Colors.textOnPrimary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
  
  buttonTextSecondary: {
    color: Colors.primary,
  },
  
  buttonTextSmall: {
    fontSize: Typography.fontSize.sm,
  },
  
  buttonIcon: {
    marginRight: Spacing.sm,
  },
  
  // Input styles
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.base,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    height: Layout.inputHeight.base,
  },
  
  inputFocused: {
    borderColor: Colors.primary,
    ...Shadows.sm,
  },
  
  inputError: {
    borderColor: Colors.error,
  },
  
  inputLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  
  inputHelperText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  
  inputErrorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.base,
  },
  
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...Shadows.xl,
  },
  
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  
  modalSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  
  modalButton: {
    flex: 1,
  },
  
  // List styles
  listContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    ...Shadows.base,
  },
  
  listItem: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  listItemLast: {
    borderBottomWidth: 0,
  },
  
  listItemTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  
  listItemSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  
  // Text styles
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  
  body: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.base,
  },
  
  caption: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  
  small: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
  },
  
  // Status text
  successText: {
    color: Colors.success,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  warningText: {
    color: Colors.warning,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  errorText: {
    color: Colors.error,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  // Layout helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  flex1: {
    flex: 1,
  },
  
  // Spacing helpers
  marginBottom: {
    marginBottom: Spacing.base,
  },
  
  marginTop: {
    marginTop: Spacing.base,
  },
  
  marginVertical: {
    marginVertical: Spacing.base,
  },
  
  marginHorizontal: {
    marginHorizontal: Spacing.base,
  },
  
  paddingBottom: {
    paddingBottom: Spacing.base,
  },
  
  paddingTop: {
    paddingTop: Spacing.base,
  },
  
  paddingVertical: {
    paddingVertical: Spacing.base,
  },
  
  paddingHorizontal: {
    paddingHorizontal: Spacing.base,
  },
});
