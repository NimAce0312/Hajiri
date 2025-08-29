import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Card } from './UI';
import { getBSWeekday, getTodayBSString } from '../utils/nepaliDateHelper';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarGrid = ({ 
  paddedDates, 
  getDayStatus, 
  hasSalaryReceived, 
  markAttendance,
  setSelectedDate,
  showActionSheet 
}) => {
  // Render each day in the calendar
  const renderDay = ({ item: date }) => {
    if (!date) {
      return <View style={[styles.day, styles.emptyDay]} />;
    }
    
    const status = getDayStatus(date);
    const hasReceived = hasSalaryReceived(date);
    const isToday = date === getTodayBSString();

    let backgroundColor;
    let textColor = Colors.textOnDark;
    
    if (isToday) {
      backgroundColor = Colors.today;
      textColor = Colors.textPrimary;
    } else {
      switch (status) {
        case 'present':
          backgroundColor = Colors.present;
          break;
        case 'absent':
          backgroundColor = Colors.absent;
          break;
        case 'holiday':
          backgroundColor = Colors.holiday;
          break;
        default:
          backgroundColor = Colors.present;
      }
    }

    return (
      <TouchableOpacity
        style={[
          styles.day, 
          { backgroundColor },
          isToday && styles.todayDay,
          hasReceived && styles.dayWithSalary
        ]}
        onPress={() => {
          if (status !== 'holiday') {
            const nextStatus = status === 'present' ? 'absent' : 'present';
            markAttendance(date, nextStatus);
          }
          setSelectedDate(date);
        }}
        onLongPress={() => {
          setSelectedDate(date);
          showActionSheet(date, status, hasReceived);
        }}
        delayLongPress={500}
        activeOpacity={0.8}
      >
        <Text style={[styles.dayText, { color: textColor }]}>
          {date.split('-')[2]}
        </Text>
        {hasReceived && (
          <View style={styles.salaryIndicator}>
            <AntDesign name="wallet" size={8} color={Colors.warning} />
          </View>
        )}
        {isToday && <View style={styles.todayIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <Card style={styles.calendarCard}>
      {/* Days of the Week */}
      <View style={styles.daysHeader}>
        {DAYS.map((day, index) => (
          <Text key={index} style={styles.dayHeaderText}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        <FlatList
          data={paddedDates}
          renderItem={renderDay}
          keyExtractor={(item, index) => item || `empty-${index}`}
          numColumns={7}
          scrollEnabled={false}
          style={styles.calendar}
        />
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.present }]} />
            <Text style={styles.legendText}>Present</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.absent }]} />
            <Text style={styles.legendText}>Absent</Text>
          </View>
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.holiday }]} />
            <Text style={styles.legendText}>Holiday</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.today }]} />
            <Text style={styles.legendText}>Today</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  calendarCard: {
    marginBottom: Spacing.xs,
  },
  
  daysHeader: {
    flexDirection: 'row',
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginBottom: Spacing.base,
  },
  
  dayHeaderText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  
  calendarGrid: {
    marginBottom: Spacing.base,
  },
  
  calendar: {
    width: '100%',
  },
  
  day: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: BorderRadius.sm,
    position: 'relative',
    minHeight: 44,
    ...Shadows.sm,
  },
  
  emptyDay: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  
  todayDay: {
    borderWidth: 2,
    borderColor: Colors.textPrimary,
  },
  
  dayWithSalary: {
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  
  dayText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  salaryIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  
  todayIndicator: {
    position: 'absolute',
    bottom: 2,
    left: '50%',
    marginLeft: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textPrimary,
  },
  
  legend: {
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.sm,
  },
  
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.xs,
  },
  
  legendText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
});

export default CalendarGrid;
