import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Button,
  Alert,
} from 'react-native';
import { AttendanceContext } from '../context/AttendanceContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  getBSMonthDates,
  getBSWeekday,
  getBSDaysInMonth,
  getBSMonthName,
  getTodayBSString,
} from '../utils/nepaliDateHelper';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

  const dates = getBSMonthDates(currentYear, currentMonth);
  const firstDayWeekday = getBSWeekday(
    `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`,
  );
  const paddedDates = Array(firstDayWeekday).fill(null).concat(dates);

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

  // Render each day in the calendar
  const renderDay = ({ item: date }) => {
    if (!date) {
      return <View style={[styles.day, styles.emptyDay]} />;
    }
    const status = getDayStatus(date);
    const hasReceived = hasSalaryReceived(date);
    const isToday = date === getTodayBSString();

    let backgroundColor;
    if (isToday) {
      backgroundColor = 'orange'; // Highlight today in orange/yellow
    } else {
      backgroundColor = {
        present: 'green',
        absent: 'red',
        holiday: 'blue',
      }[status];
    }

    return (
      <TouchableOpacity
        style={[styles.day, { backgroundColor }]}
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
        delayLongPress={500}>
        <Text style={[styles.dayText, isToday && styles.todayText]}>
          {date.split('-')[2]}
        </Text>
        {hasReceived && <View style={styles.salaryIndicator} />}
      </TouchableOpacity>
    );
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

  // Render days of the week header
  const renderDaysHeader = () => (
    <View style={styles.daysHeader}>
      {DAYS.map((day, index) => (
        <Text key={index} style={styles.dayHeaderText}>
          {day}
        </Text>
      ))}
    </View>
  );

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

  return (
    <View style={styles.container}>
      {/* Month Navigation */}
      <View style={styles.monthNav}>
        <Button 
          title="Prev" 
          onPress={() => changeMonth(-1)}
          disabled={isAtEarliestMonth()}
        />
        <Text style={styles.monthTitle}>
          {getBSMonthName(currentMonth)} {currentYear}
        </Text>
        <Button 
          title="Next" 
          onPress={() => changeMonth(1)}
          disabled={isAtLatestMonth()}
        />
      </View>

      {/* Days of the Week */}
      {renderDaysHeader()}

      {/* Calendar Grid */}
      <View style={styles.calendarContainer}>
        <FlatList
          data={paddedDates}
          renderItem={renderDay}
          keyExtractor={(item, index) => item || `empty-${index}`}
          numColumns={7}
          style={styles.calendar}
          contentContainerStyle={styles.calendarContent}
        />
      </View>

      {/* Modal for Holiday/Salary */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {modalType === 'holiday' && `Mark ${selectedDate} as Holiday`}
                  {modalType === 'unmark_holiday' && `Unmark ${selectedDate} as Holiday?`}
                  {modalType === 'salary' && `Salary Received on ${selectedDate}`}
                </Text>

                {modalType === 'holiday' && (
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter reason (optional)"
                    value={holidayReason}
                    onChangeText={setHolidayReason}
                  />
                )}

                {modalType === 'salary' && (
                  <>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Enter amount received"
                      value={salaryAmount}
                      onChangeText={setSalaryAmount}
                      keyboardType="numeric"
                    />
                    <Text style={styles.modalSubtitle}>
                      This salary is for which month? (Leave empty for auto-detect)
                    </Text>
                    <View style={styles.monthYearContainer}>
                      <TextInput
                        style={[styles.modalInput, styles.monthYearInput]}
                        placeholder={`Month (1-12)`}
                        value={salaryTargetMonth ? salaryTargetMonth.toString() : ''}
                        onChangeText={(text) => setSalaryTargetMonth(text ? parseInt(text) : null)}
                        keyboardType="numeric"
                        maxLength={2}
                      />
                      <TextInput
                        style={[styles.modalInput, styles.monthYearInput]}
                        placeholder={`Year (e.g. ${currentYear})`}
                        value={salaryTargetYear ? salaryTargetYear.toString() : ''}
                        onChangeText={(text) => setSalaryTargetYear(text ? parseInt(text) : null)}
                        keyboardType="numeric"
                        maxLength={4}
                      />
                    </View>
                  </>
                )}

                <View style={styles.modalButtons}>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      setModalVisible(false);
                      setHolidayReason('');
                      setSalaryAmount('');
                      setSalaryTargetMonth(null);
                      setSalaryTargetYear(null);
                    }}
                  />
                  <Button
                    title={modalType === 'unmark_holiday' ? 'Unmark' : 'Save'}
                    onPress={handleModalSubmit}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Salary Estimation */}
      <View style={styles.salarySection}>
        {selectedDate && showSelectedInfo && getDayStatus(selectedDate) === 'holiday' && (
          <Text style={styles.holidayReason}>
            Holiday Reason: {getHolidayReason(selectedDate) || 'None'}
          </Text>
        )}
        <View style={styles.salaryInputContainer}>
          {editingSalary ? (
            <View style={styles.salaryEditContainer}>
              <TextInput
                style={styles.salaryInput}
                keyboardType="numeric"
                placeholder="Monthly Salary (NPR)"
                value={tempSalary}
                onChangeText={setTempSalary}
                onSubmitEditing={() => handleSalarySave()}
                autoFocus
              />
              <View style={styles.salaryButtons}>
                <TouchableOpacity 
                  onPress={handleSalarySave}
                  style={styles.salaryButton}
                >
                  <AntDesign name="check" size={24} color="green" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleSalaryDiscard}
                  style={styles.salaryButton}
                >
                  <AntDesign name="close" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.salaryStatic}>
              <Text style={styles.salaryStaticText}>
                Monthly Salary: NPR {currentSalary}
              </Text>
              <TouchableOpacity onPress={handleSalaryEditStart}>
                <AntDesign name="edit" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text style={styles.estimate}>
          Estimated Salary: NPR {calculateSalary()}
        </Text>
        {monthSalaryReceived && (
          <Text style={styles.monthSalaryReceived}>
            Salary Received: NPR {monthSalaryReceived.amount}
            {monthSalaryReceived.date && ` on ${monthSalaryReceived.date}`}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  monthTitle: { fontSize: 20, fontWeight: 'bold' },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  dayHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  calendar: {
    flex: 1,
  },
  calendarContent: {
    width: '100%',
  },
  day: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    borderRadius: 4,
    position: 'relative',
    maxWidth: '14.28%', // Ensure 7 columns fit properly
  },
  emptyDay: { backgroundColor: 'transparent' },
  dayText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  todayText: { color: 'black', fontWeight: 'bold' }, // Black text for today
  salaryIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'yellow',
    borderWidth: 1,
    borderColor: 'black',
  },
  salarySection: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  salaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  salaryInputContainer: { width: '80%', marginBottom: 10 },
  salaryEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  salaryInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  salaryButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salaryButton: {
    marginLeft: 10,
    padding: 5,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  salaryStatic: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  salaryStaticText: { fontSize: 16, marginRight: 15 },
  estimate: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  monthSalaryReceived: { 
    fontSize: 16, 
    color: 'green', 
    fontWeight: 'bold', 
    marginBottom: 10,
    textAlign: 'center' 
  },
  holidayReason: { fontSize: 14, color: 'gray', marginBottom: 5 },
  salaryReceived: { fontSize: 14, color: 'green', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalSubtitle: { 
    fontSize: 14, 
    color: 'gray', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  monthYearContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  monthYearInput: {
    width: '45%',
    marginBottom: 0,
  },
  modalInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default CalendarScreen;