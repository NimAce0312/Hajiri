import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './UI';
import { Colors, Typography, Spacing } from '../constants/theme';

const SelectedDateInfo = ({ selectedDate, getHolidayReason, getDayStatus, showSelectedInfo }) => {
  if (!selectedDate || !showSelectedInfo || getDayStatus(selectedDate) !== 'holiday') {
    return null;
  }

  return (
    <Card title="Holiday Information" style={styles.infoCard}>
      <Text style={styles.infoText}>
        <Text style={styles.infoLabel}>Date: </Text>
        {selectedDate}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.infoLabel}>Reason: </Text>
        {getHolidayReason(selectedDate) || 'No reason specified'}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    marginBottom: Spacing.xs,
    backgroundColor: Colors.highlight,
  },
  
  infoText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  
  infoLabel: {
    fontWeight: Typography.fontWeight.semibold,
  },
});

export default SelectedDateInfo;
