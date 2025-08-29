import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Card, Input } from './UI';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const SalaryInformation = ({ 
  currentSalary,
  calculateSalary,
  monthSalaryReceived,
  editingSalary,
  tempSalary,
  setTempSalary,
  onSalaryEditStart,
  onSalarySave,
  onSalaryDiscard
}) => {
  return (
    <Card style={styles.salaryCard}>
      <View style={styles.salaryRow}>
        {editingSalary ? (
          <View style={styles.salaryEditWrapper}>
            <Text style={styles.salaryEditLabel}>Edit Monthly Salary</Text>
            <View style={styles.salaryEditContainer}>
              <Input
                placeholder="Enter monthly salary amount"
                value={tempSalary}
                onChangeText={setTempSalary}
                keyboardType="numeric"
                icon="wallet"
                containerStyle={styles.salaryInputContainer}
              />
              <View style={styles.salaryEditActions}>
                <TouchableOpacity onPress={onSalarySave} style={[styles.actionButton, styles.saveButton]}>
                  <AntDesign name="check" size={18} color={Colors.textOnDark} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onSalaryDiscard} style={[styles.actionButton, styles.cancelButton]}>
                  <AntDesign name="close" size={18} color={Colors.textOnDark} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.salaryDisplayContainer}>
            <Text style={styles.salaryAmount}>
              Monthly Salary: NPR {currentSalary.toLocaleString()}
            </Text>
            <TouchableOpacity onPress={onSalaryEditStart} style={styles.editButton}>
              <AntDesign name="edit" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.salaryStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Estimated Salary</Text>
          <Text style={styles.statValue}>NPR {parseFloat(calculateSalary()).toLocaleString()}</Text>
        </View>
        
        {monthSalaryReceived && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Salary Received</Text>
            <Text style={[styles.statValue, styles.receivedAmount]}>
              NPR {monthSalaryReceived.amount.toLocaleString()}
            </Text>
            {monthSalaryReceived.date && (
              <Text style={styles.receivedDate}>on {monthSalaryReceived.date}</Text>
            )}
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  salaryCard: {
    marginBottom: Spacing.xs,
  },
  
  salaryRow: {
    marginBottom: Spacing.base,
  },
  
  salaryEditWrapper: {
    marginBottom: Spacing.base,
  },
  
  salaryEditLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  
  salaryEditContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.md,
  },
  
  salaryInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  
  salaryEditActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.base,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  
  saveButton: {
    backgroundColor: Colors.success,
  },
  
  cancelButton: {
    backgroundColor: Colors.error,
  },
  
  salaryDisplayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  
  salaryAmount: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  
  editButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.base,
    backgroundColor: Colors.surfaceSecondary,
  },
  
  salaryStats: {
    gap: Spacing.base,
  },
  
  statItem: {
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    alignItems: 'center',
  },
  
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
  },
  
  statValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  
  receivedAmount: {
    color: Colors.success,
  },
  
  receivedDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
});

export default SalaryInformation;
