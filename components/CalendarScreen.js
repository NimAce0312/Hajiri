import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { AttendanceContext } from '../context/AttendanceContext';
import {
  getBSMonthDates,
  getBSWeekday,
  getBSDaysInMonth,
  getTodayBSString,
} from '../utils/nepaliDateHelper';
import { Colors, Spacing } from '../constants/theme';
import Header from './Header';
import MonthNavigation from './MonthNavigation';
import CalendarGrid from './CalendarGrid';
import SelectedDateInfo from './SelectedDateInfo';
import SalaryInformation from './SalaryInformation';
import CalendarModal from './CalendarModal';

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
  const [showSelectedInfo, setShowSelectedInfo] = useState(false);
  const [tempSalary, setTempSalary] = useState('');
  const selectedInfoTimer = useRef(null);

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

  // Effect to handle selected date info timer
  useEffect(() => {
    if (selectedDate) {
      setShowSelectedInfo(true);
      
      // Clear existing timer
      if (selectedInfoTimer.current) {
        clearTimeout(selectedInfoTimer.current);
      }
      
      // Set new timer to hide info after 7 seconds
      selectedInfoTimer.current = setTimeout(() => {
        setShowSelectedInfo(false);
      }, 7000);
    } else {
      setShowSelectedInfo(false);
      if (selectedInfoTimer.current) {
        clearTimeout(selectedInfoTimer.current);
      }
    }

    // Cleanup timer on unmount
    return () => {
      if (selectedInfoTimer.current) {
        clearTimeout(selectedInfoTimer.current);
      }
    };
  }, [selectedDate]);

  // Determine the status of a day
  const getDayStatus = date => {
    if (!date) return 'empty';
    const weekday = getBSWeekday(date);

    // Saturday (6) is holiday by default
    if (weekday === 6) {
      return 'holiday';
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
      const status = attendance[date];
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

    if (status === 'holiday' && getBSWeekday(date) !== 6) {
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
    switch (choice) {
      case 'Mark as Holiday':
        setModalType('holiday');
        setHolidayReason('');
        setModalVisible(true);
        break;
      case 'Unmark Holiday':
        setModalType('unmark_holiday');
        setModalVisible(true);
        break;
      case 'Add Salary Received':
        setModalType('salary');
        setSalaryAmount('');
        setModalVisible(true);
        break;
      case 'View/Edit Salary Received':
        const received = getSalaryReceived(date);
        setModalType('salary');
        setSalaryAmount(received?.amount?.toString() || '');
        setModalVisible(true);
        break;
      case 'Remove Salary Record':
        removeSalaryReceived(date);
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
    if (modalType === 'holiday') {
      addHoliday(selectedDate, holidayReason);
    } else if (modalType === 'unmark_holiday') {
      removeHoliday(selectedDate);
    } else if (modalType === 'salary') {
      const amount = parseFloat(salaryAmount);
      if (amount > 0) {
        // Use the selected month/year or default logic
        addSalaryReceived(selectedDate, amount, salaryTargetMonth, salaryTargetYear);
      }
    }

    setModalVisible(false);
    setHolidayReason('');
    setSalaryAmount('');
    setSalaryTargetMonth(null);
    setSalaryTargetYear(null);
    setSelectedDate(null);
  };

  const currentSalary = getSalaryForMonth(currentYear, currentMonth);
  const monthSalaryReceived = getSalaryReceivedForMonth(currentYear, currentMonth);

  const handleModalClose = () => {
    setModalVisible(false);
    setHolidayReason('');
    setSalaryAmount('');
    setSalaryTargetMonth(null);
    setSalaryTargetYear(null);
  };

  return (
    <View style={styles.container}>
      <Header 
        onExport={handleExportData}
        onImport={handleImportData}
      />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <MonthNavigation 
          currentYear={currentYear}
          currentMonth={currentMonth}
          onChangeMonth={changeMonth}
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
        />

        <SelectedDateInfo 
          selectedDate={selectedDate}
          getHolidayReason={getHolidayReason}
          getDayStatus={getDayStatus}
          showSelectedInfo={showSelectedInfo}
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
  
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.base,
  },
});

export default CalendarScreen;