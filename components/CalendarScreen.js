import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  PanResponder,
} from 'react-native';
import { AttendanceContext } from '../context/AttendanceContext';
import {
  getBSMonthDates,
  getBSWeekday,
  getBSDaysInMonth,
  getTodayBSString,
  getCurrentBSDate,
  getBSMonthName,
} from '../utils/nepaliDateHelper';
import { Colors, Spacing } from '../constants/theme';
import Header from './Header';
import MonthNavigation from './MonthNavigation';
import CalendarGrid from './CalendarGrid';
import SalaryInformation from './SalaryInformation';
import CalendarModal from './CalendarModal';
import { Toast } from './UI';

const CalendarScreen = () => {
  const {
    attendance,
    markAttendance,
    getSalaryForMonth,
    setSalaryForMonth,
    addSalaryReceived,
    getSalaryReceived,
    getSalaryReceivedForMonth,
    removeSalaryReceived,
    holidays,
    addHoliday,
    removeHoliday,
    getHolidayReason,
    selectedDate,
    setSelectedDate,
    editingSalary,
    setEditingSalary,
    currentYear,
    setCurrentYear,
    currentMonth,
    setCurrentMonth,
    exportData,
    importData,
  } = useContext(AttendanceContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'holiday', 'salary', 'unmark_holiday', 'unmark_salary'
  const [holidayReason, setHolidayReason] = useState('');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [salaryTargetMonth, setSalaryTargetMonth] = useState(null);
  const [salaryTargetYear, setSalaryTargetYear] = useState(null);
  const [tempSalary, setTempSalary] = useState('');
  
  // Store the date being processed to avoid timing issues
  const [dateBeingProcessed, setDateBeingProcessed] = useState(null);
  
  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  // Swipe gesture detection
  const swipeThreshold = 50; // Minimum distance for a swipe
  const velocityThreshold = 0.5; // Minimum velocity for a swipe

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Only respond to horizontal swipes
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
    },
    onPanResponderMove: (evt, gestureState) => {
      // Optional: Add visual feedback during swipe
    },
    onPanResponderRelease: (evt, gestureState) => {
      const { dx, vx } = gestureState;
      
      // Check if it's a valid swipe (distance and velocity)
      if (Math.abs(dx) > swipeThreshold && Math.abs(vx) > velocityThreshold) {
        if (dx > 0) {
          // Swipe right - go to previous month
          if (!isAtEarliestMonth()) {
            changeMonth(-1);
          }
        } else {
          // Swipe left - go to next month
          if (!isAtLatestMonth()) {
            changeMonth(1);
          }
        }
      }
    },
  });

  // Import/Export handlers
  const handleExportData = async () => {
    try {
      const success = await exportData();
      if (success) {
        Alert.alert('Success', 'Data exported successfully!');
      }
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export data. Please try again.');
    }
  };

  const handleImportData = async () => {
    try {
      const success = await importData();
      if (success) {
        Alert.alert('Success', 'Data imported successfully!');
      }
    } catch (error) {
      Alert.alert('Import Failed', 'Failed to import data. Please try again.');
    }
  };

  const dates = getBSMonthDates(currentYear, currentMonth);
  const firstDayWeekday = getBSWeekday(
    `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`,
  );
  
  // Get the last date of the month to determine its weekday
  const lastDate = dates[dates.length - 1];
  const lastDayWeekday = getBSWeekday(lastDate);
  
  // Calculate how many null values to add at the end (until Saturday = 6)
  const trailingNulls = lastDayWeekday === 6 ? 0 : 6 - lastDayWeekday;
  
  const paddedDates = Array(firstDayWeekday).fill(null)
    .concat(dates)
    .concat(Array(trailingNulls).fill(null));

  // Check if we're at the earliest date (2082-01)
  const isAtEarliestMonth = () => {
    return currentYear === 2082 && currentMonth === 1;
  };

  // Check if we're at the latest date (2090-12)
  const isAtLatestMonth = () => {
    return currentYear === 2090 && currentMonth === 12;
  };

  // Effect to show toast when holiday date is selected
  useEffect(() => {
    if (selectedDate && !modalVisible) {
      const status = getDayStatus(selectedDate);
      if (status === 'holiday') {
        const reason = getHolidayReason(selectedDate);
        const dayType = getBSWeekday(selectedDate) === 6 ? 'Saturday' : 'Holiday';
        const message = reason 
          ? `${dayType}: ${reason}` 
          : `${dayType} - No reason specified`;
        
        showToast(message, 'info');
        
        // Only clear selection if no modal type is set (meaning no action sheet was triggered)
        if (!modalType) {
          setTimeout(() => {
            setSelectedDate(null);
          }, 100);
        }
      }
    }
  }, [selectedDate, modalVisible, modalType]);

  // Toast functions
  const showToast = (message, type = 'info', duration = 3000) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  // Helper function to check if a Saturday is sandwiched between absent days
  const isSandwichSaturday = (date) => {
    const weekday = getBSWeekday(date);
    if (weekday !== 6) return false; // Not a Saturday
    
    // Parse the date to get year, month, day
    const [year, month, day] = date.split('-').map(Number);
    
    // Calculate Friday (previous day) and Sunday (next day)
    const fridayDay = day - 1;
    const sundayDay = day + 1;
    
    let fridayDate, sundayDate;
    
    // Handle month boundaries for Friday
    if (fridayDay < 1) {
      // Friday is in previous month
      const prevMonth = month - 1;
      if (prevMonth < 1) {
        // Previous year
        const prevYear = year - 1;
        const daysInPrevMonth = getBSDaysInMonth(prevYear, 12);
        fridayDate = `${prevYear}-12-${String(daysInPrevMonth).padStart(2, '0')}`;
      } else {
        const daysInPrevMonth = getBSDaysInMonth(year, prevMonth);
        fridayDate = `${year}-${String(prevMonth).padStart(2, '0')}-${String(daysInPrevMonth).padStart(2, '0')}`;
      }
    } else {
      fridayDate = `${year}-${String(month).padStart(2, '0')}-${String(fridayDay).padStart(2, '0')}`;
    }
    
    // Handle month boundaries for Sunday
    const daysInCurrentMonth = getBSDaysInMonth(year, month);
    if (sundayDay > daysInCurrentMonth) {
      // Sunday is in next month
      const nextMonth = month + 1;
      if (nextMonth > 12) {
        // Next year
        const nextYear = year + 1;
        sundayDate = `${nextYear}-01-01`;
      } else {
        sundayDate = `${year}-${String(nextMonth).padStart(2, '0')}-01`;
      }
    } else {
      sundayDate = `${year}-${String(month).padStart(2, '0')}-${String(sundayDay).padStart(2, '0')}`;
    }
    
    // Check if both Friday and Sunday are marked as absent
    const fridayStatus = attendance[fridayDate];
    const sundayStatus = attendance[sundayDate];
    
    return fridayStatus === 'absent' && sundayStatus === 'absent';
  };

  // Determine the status of a day
  const getDayStatus = date => {
    if (!date) return 'empty';
    const weekday = getBSWeekday(date);

    // Saturday (6) is holiday by default, but check for sandwich rule
    if (weekday === 6) {
      if (isSandwichSaturday(date)) {
        return 'absent'; // Sandwich Saturday - treat as absent
      }
      return 'holiday'; // Normal Saturday - treat as holiday
    }

    // Check if date is marked as holiday in the holidays array
    if (holidays.some(h => h.date === date)) return 'holiday';
    return attendance[date] || 'present';
  };

  // Check if salary was received on this date
  const hasSalaryReceived = date => {
    return getSalaryReceived(date) !== undefined;
  };

  // Calculate the estimated salary (only deduct absent days, 1 paid leave)
  const calculateSalary = () => {
    const daysInMonth = getBSDaysInMonth(currentYear, currentMonth);
    const dates = getBSMonthDates(currentYear, currentMonth);
    const monthlySalary = getSalaryForMonth(currentYear, currentMonth);

    let absentDates = dates.filter(date => {
      const status = getDayStatus(date); // Use getDayStatus which includes sandwich Saturday logic
      return status === 'absent';
    });

    // Apply 1 paid leave logic
    if (absentDates.length > 0) {
      absentDates = absentDates.slice(1); // Remove 1 absent day (paid leave)
    }

    const payableDays = daysInMonth - absentDates.length;
    const dailyRate = monthlySalary / daysInMonth;
    return (payableDays * dailyRate).toFixed(2);
  };

  // Show action sheet for long press
  const showActionSheet = (date, status, hasReceived) => {
    const options = [];
    const weekday = getBSWeekday(date);
    const isManuallyMarkedHoliday = holidays.some(h => h.date === date);

    // Show unmark holiday only for manually marked holidays (not automatic Saturdays)
    if (isManuallyMarkedHoliday) {
      options.push('Unmark Holiday');
    } else if (status !== 'holiday') {
      options.push('Mark as Holiday');
    }

    if (hasReceived) {
      options.push('View/Edit Salary Received');
      options.push('Remove Salary Record');
    } else {
      options.push('Add Salary Received');
    }

    options.push('Cancel');

    Alert.alert(
      `${date} Options`,
      'Choose an action:',
      options.map(option => ({
        text: option,
        onPress: () => handleActionSheetChoice(option, date, status, hasReceived)
      }))
    );
  };

  const handleActionSheetChoice = (choice, date, status, hasReceived) => {
    // Store the date being processed
    setDateBeingProcessed(date);
    
    switch (choice) {
      case 'Mark as Holiday':
        setSelectedDate(date); // Ensure selectedDate is set
        setModalType('holiday');
        setHolidayReason('');
        setModalVisible(true);
        break;
      case 'Unmark Holiday':
        setSelectedDate(date); // Ensure selectedDate is set
        setModalType('unmark_holiday');
        setModalVisible(true);
        break;
      case 'Add Salary Received':
        setSelectedDate(date); // Ensure selectedDate is set
        setModalType('salary');
        setSalaryAmount('');
        setModalVisible(true);
        break;
      case 'View/Edit Salary Received':
        setSelectedDate(date); // Ensure selectedDate is set
        const received = getSalaryReceived(date);
        setModalType('salary');
        setSalaryAmount(received?.amount?.toString() || '');
        setModalVisible(true);
        break;
      case 'Remove Salary Record':
        removeSalaryReceived(date);
        showToast(`Salary record removed for ${date}`, 'success');
        break;
    }
  };

  // Change the month
  const changeMonth = delta => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // Navigate to current month and year
  const navigateToToday = () => {
    const today = getCurrentBSDate();
    setCurrentYear(today.year);
    setCurrentMonth(today.month);
  };

  // Handle salary edit submission
  const handleSalarySubmit = text => {
    const newSalary = parseFloat(text) || 0;
    setSalaryForMonth(currentYear, currentMonth, newSalary);
    setEditingSalary(false);
    setTempSalary('');
  };

  // Handle salary save
  const handleSalarySave = () => {
    const newSalary = parseFloat(tempSalary) || currentSalary;
    setSalaryForMonth(currentYear, currentMonth, newSalary);
    setEditingSalary(false);
    setTempSalary('');
  };

  // Handle salary discard
  const handleSalaryDiscard = () => {
    setEditingSalary(false);
    setTempSalary('');
  };

  // Handle salary edit start
  const handleSalaryEditStart = () => {
    setTempSalary(currentSalary.toString());
    setEditingSalary(true);
  };

  // Handle modal submission
  const handleModalSubmit = () => {
    // Use dateBeingProcessed as fallback if selectedDate is null
    const dateToProcess = selectedDate || dateBeingProcessed;
    
    if (modalType === 'holiday') {
      addHoliday(dateToProcess, holidayReason);
    } else if (modalType === 'unmark_holiday') {
      removeHoliday(dateToProcess);
    } else if (modalType === 'salary') {
      const amount = parseFloat(salaryAmount);
      if (amount > 0) {
        // Use the selected month/year or default logic
        addSalaryReceived(dateToProcess, amount, salaryTargetMonth, salaryTargetYear);
      }
    }

    setModalVisible(false);
    setHolidayReason('');
    setSalaryAmount('');
    setSalaryTargetMonth(null);
    setSalaryTargetYear(null);
    setSelectedDate(null);
    setDateBeingProcessed(null); // Clear the backup date
  };

  const currentSalary = getSalaryForMonth(currentYear, currentMonth);
  const monthSalaryReceived = getSalaryReceivedForMonth(currentYear, currentMonth);

  const handleModalClose = () => {
    setModalVisible(false);
    setHolidayReason('');
    setSalaryAmount('');
    setSalaryTargetMonth(null);
    setSalaryTargetYear(null);
    setDateBeingProcessed(null); // Clear the backup date
    setModalType(''); // Clear modal type
  };

  return (
    <View style={styles.container}>
      <Header 
        onExport={handleExportData}
        onImport={handleImportData}
      />

      <View style={styles.swipeContainer} {...panResponder.panHandlers}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <MonthNavigation 
            currentYear={currentYear}
            currentMonth={currentMonth}
            onChangeMonth={changeMonth}
            onNavigateToToday={navigateToToday}
            isAtEarliestMonth={isAtEarliestMonth}
            isAtLatestMonth={isAtLatestMonth}
          />

          <CalendarGrid 
            paddedDates={paddedDates}
            getDayStatus={getDayStatus}
            hasSalaryReceived={hasSalaryReceived}
            markAttendance={markAttendance}
            setSelectedDate={setSelectedDate}
            showActionSheet={showActionSheet}
            attendance={attendance}
          />

          <SalaryInformation 
            currentSalary={currentSalary}
            calculateSalary={calculateSalary}
            monthSalaryReceived={monthSalaryReceived}
            editingSalary={editingSalary}
            tempSalary={tempSalary}
            setTempSalary={setTempSalary}
            onSalaryEditStart={handleSalaryEditStart}
            onSalarySave={handleSalarySave}
            onSalaryDiscard={handleSalaryDiscard}
          />
        </ScrollView>
      </View>

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={hideToast}
        duration={4000}
      />

      <CalendarModal 
        modalVisible={modalVisible}
        modalType={modalType}
        selectedDate={selectedDate}
        holidayReason={holidayReason}
        setHolidayReason={setHolidayReason}
        salaryAmount={salaryAmount}
        setSalaryAmount={setSalaryAmount}
        salaryTargetMonth={salaryTargetMonth}
        setSalaryTargetMonth={setSalaryTargetMonth}
        salaryTargetYear={salaryTargetYear}
        setSalaryTargetYear={setSalaryTargetYear}
        currentYear={currentYear}
        onModalSubmit={handleModalSubmit}
        onModalClose={handleModalClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  swipeContainer: {
    flex: 1,
  },
  
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.base,
  },
});

export default CalendarScreen;