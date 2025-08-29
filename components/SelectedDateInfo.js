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
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          <Text style={styles.infoLabel}>Date: </Text>
          {selectedDate}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoText} numberOfLines={2}>
          <Text style={styles.infoLabel}>Reason: </Text>
          {getHolidayReason(selectedDate) || 'No reason specified'}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    marginBottom: Spacing.xs,
    backgroundColor: Colors.highlight,
  },
  
  infoRow: {
    marginBottom: 4,
  },
  
  infoText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
    flexWrap: 'wrap',
  },
  
  infoLabel: {
    fontWeight: Typography.fontWeight.semibold,
  },
});

export default SelectedDateInfo;
