import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './UI';
import { Colors, Typography, Spacing, Shadows } from '../constants/theme';

const Header = ({ onExport, onImport }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.appTitle}>Hajiri</Text>
      <View style={styles.headerActions}>
        <Button
          icon="export"
          title="Export"
          onPress={onExport}
          size="small"
          variant="success"
          style={styles.headerButton}
        />
        <Button
          icon="download"
          title="Import"
          onPress={onImport}
          size="small"
          variant="primary"
          style={styles.headerButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    ...Shadows.sm,
  },
  
  appTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  
  headerButton: {
    minWidth: 90,
    paddingHorizontal: Spacing.md,
  },
});

export default Header;
