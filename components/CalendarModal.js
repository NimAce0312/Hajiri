import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomModal, Input } from './UI';
import { Colors, Typography, Spacing } from '../constants/theme';

const CalendarModal = ({
  modalVisible,
  modalType,
  selectedDate,
  holidayReason,
  setHolidayReason,
  salaryAmount,
  setSalaryAmount,
  salaryTargetMonth,
  setSalaryTargetMonth,
  salaryTargetYear,
  setSalaryTargetYear,
  currentYear,
  onModalSubmit,
  onModalClose
}) => {
  const getModalTitle = () => {
    switch (modalType) {
      case 'holiday':
        return `Mark ${selectedDate} as Holiday`;
      case 'unmark_holiday':
        return `Unmark ${selectedDate} as Holiday?`;
      case 'salary':
        return `Salary Received on ${selectedDate}`;
      default:
        return '';
    }
  };

  const getModalSubtitle = () => {
    switch (modalType) {
      case 'unmark_holiday':
        return 'This will remove the holiday marking for this date.';
      case 'salary':
        return 'Enter the salary amount you received on this date.';
      default:
        return '';
    }
  };

  return (
    <CustomModal
      visible={modalVisible}
      onClose={onModalClose}
      title={getModalTitle()}
      subtitle={getModalSubtitle()}
      primaryAction={{
        title: modalType === 'unmark_holiday' ? 'Unmark' : 'Save',
        onPress: onModalSubmit,
      }}
      secondaryAction={{
        title: 'Cancel',
        onPress: onModalClose,
      }}
    >
      {modalType === 'holiday' && (
        <Input
          label="Reason (Optional)"
          placeholder="Enter holiday reason"
          value={holidayReason}
          onChangeText={setHolidayReason}
          multiline
          numberOfLines={3}
        />
      )}

      {modalType === 'salary' && (
        <>
          <Input
            label="Amount Received"
            placeholder="Enter amount received"
            value={salaryAmount}
            onChangeText={setSalaryAmount}
            keyboardType="numeric"
            icon="wallet"
          />
          
          <Text style={styles.modalSectionTitle}>
            Which month is this salary for? (Optional)
          </Text>
          <Text style={styles.modalHelperText}>
            Leave empty for auto-detection based on the selected date
          </Text>
          
          <View style={styles.monthYearRow}>
            <Input
              label="Month"
              placeholder="1-12"
              value={salaryTargetMonth ? salaryTargetMonth.toString() : ''}
              onChangeText={(text) => setSalaryTargetMonth(text ? parseInt(text) : null)}
              keyboardType="numeric"
              containerStyle={styles.monthYearInput}
            />
            <Input
              label="Year"
              placeholder={`e.g. ${currentYear}`}
              value={salaryTargetYear ? salaryTargetYear.toString() : ''}
              onChangeText={(text) => setSalaryTargetYear(text ? parseInt(text) : null)}
              keyboardType="numeric"
              containerStyle={styles.monthYearInput}
            />
          </View>
        </>
      )}
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  modalSectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.base,
    marginBottom: Spacing.xs,
  },
  
  modalHelperText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.base,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  
  monthYearRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  
  monthYearInput: {
    flex: 1,
  },
});

export default CalendarModal;
