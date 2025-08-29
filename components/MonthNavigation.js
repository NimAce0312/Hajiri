import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card } from './UI';
import { getBSMonthName } from '../utils/nepaliDateHelper';
import { Colors, Typography, Spacing } from '../constants/theme';

const MonthNavigation = ({ 
  currentYear, 
  currentMonth, 
  onChangeMonth, 
  isAtEarliestMonth, 
  isAtLatestMonth 
}) => {
  return (
    <Card style={styles.navigationCard}>
      <View style={styles.monthNavigation}>
        <Button
          icon="left"
          title="Prev"
          onPress={() => onChangeMonth(-1)}
          disabled={isAtEarliestMonth()}
          size="small"
          variant="secondary"
          style={styles.navButton}
        />
        <View style={styles.monthTitleContainer}>
          <Text style={styles.monthTitle}>
            {getBSMonthName(currentMonth)} {currentYear}
          </Text>
        </View>
        <Button
          icon="right"
          title="Next"
          onPress={() => onChangeMonth(1)}
          disabled={isAtLatestMonth()}
          size="small"
          variant="secondary"
          style={styles.navButton}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  navigationCard: {
    marginVertical: Spacing.xs,
  },
  
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  navButton: {
    minWidth: 80,
    paddingHorizontal: Spacing.md,
  },
  
  monthTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
  monthTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
});

export default MonthNavigation;
