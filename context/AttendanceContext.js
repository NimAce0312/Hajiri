import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getBSMonthDates, getBSWeekday, getCurrentBSDate} from '../utils/nepaliDateHelper';
import {exportAttendanceData, importAttendanceData, validateAndMigrateData} from '../utils/importExportHelper';

export const AttendanceContext = createContext();

export const AttendanceProvider = ({children}) => {
  const [attendance, setAttendance] = useState({});
  const [monthlySalaries, setMonthlySalaries] = useState({}); // Format: {'2082-01': 20000}
  const [salaryReceived, setSalaryReceived] = useState({}); // Format: {'2082-01-15': {amount: 18000, date: '2082-01-15'}}
  const [holidays, setHolidays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingSalary, setEditingSalary] = useState(false);

  // Get current BS date for initial display
  const currentBS = getCurrentBSDate();
  const [currentYear, setCurrentYear] = useState(currentBS.year);
  const [currentMonth, setCurrentMonth] = useState(currentBS.month);

  // Load data from AsyncStorage when app starts
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedAttendance = await AsyncStorage.getItem('attendance');
        const storedMonthlySalaries = await AsyncStorage.getItem('monthlySalaries');
        const storedSalaryReceived = await AsyncStorage.getItem('salaryReceived');
        const storedHolidays = await AsyncStorage.getItem('holidays');

        if (storedAttendance) {
          setAttendance(JSON.parse(storedAttendance));
        }
        if (storedMonthlySalaries) {
          setMonthlySalaries(JSON.parse(storedMonthlySalaries));
        } else {
          // Set default salary for current month
          const monthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
          setMonthlySalaries({[monthKey]: 20000});
        }
        if (storedSalaryReceived) {
          setSalaryReceived(JSON.parse(storedSalaryReceived));
        }
        if (storedHolidays) {
          setHolidays(JSON.parse(storedHolidays));
        }
      } catch (e) {
        console.error('Error loading data:', e);
      }
    };
    loadData();

    const markDefaultSaturdays = () => {
      // Mark only Saturdays as holidays for current and next year
      for (let year = currentYear; year <= currentYear + 1; year++) {
        for (let m = 1; m <= 12; m++) {
          const dates = getBSMonthDates(year, m);
          dates.forEach(date => {
            if (getBSWeekday(date) === 6) { // Only Saturday (6)
              addHoliday(date, 'Saturday');
            }
          });
        }
      }
    };

    markDefaultSaturdays();
  }, []);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('attendance', JSON.stringify(attendance));
        await AsyncStorage.setItem('monthlySalaries', JSON.stringify(monthlySalaries));
        await AsyncStorage.setItem('salaryReceived', JSON.stringify(salaryReceived));
        await AsyncStorage.setItem('holidays', JSON.stringify(holidays));
      } catch (e) {
        console.error('Error saving data:', e);
      }
    };
    saveData();
  }, [attendance, monthlySalaries, salaryReceived, holidays]);

  const markAttendance = (date, status) => {
    setAttendance(prev => ({...prev, [date]: status}));
  };

  const addHoliday = (date, reason = '') => {
    if (!holidays.some(h => h.date === date)) {
      setHolidays(prev => [...prev, {date, reason}]);
    }
  };

  const removeHoliday = date => {
    setHolidays(prev => prev.filter(h => h.date !== date));
  };

  const getHolidayReason = date => {
    const holiday = holidays.find(h => h.date === date);
    return holiday ? holiday.reason : '';
  };

  const setSalaryForMonth = (year, month, salary) => {
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    setMonthlySalaries(prev => {
      const newSalaries = {...prev};
      
      // Set salary for current month
      newSalaries[monthKey] = salary;
      
      // Update all future months (from current month onwards) within our data range
      for (let y = year; y <= 2090; y++) {
        const startMonth = y === year ? month + 1 : 1;
        const endMonth = y === 2090 ? 12 : 12; // All months for years before 2090, all months for 2090
        
        for (let m = startMonth; m <= endMonth; m++) {
          const futureMonthKey = `${y}-${String(m).padStart(2, '0')}`;
          // Always update future months with the new salary
          newSalaries[futureMonthKey] = salary;
        }
      }
      
      return newSalaries;
    });
  };

  const getSalaryForMonth = (year, month) => {
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    return monthlySalaries[monthKey] || 20000; // Default salary
  };

  const addSalaryReceived = (date, amount, forMonth = null, forYear = null) => {
    // If forMonth and forYear are not provided, assume it's for the previous month
    if (forMonth === null || forYear === null) {
      const [year, month] = date.split('-').map(Number);
      // Default assumption: salary received in month X is usually for month X-1
      if (month === 1) {
        forYear = forYear || (year - 1);
        forMonth = forMonth || 12;
      } else {
        forYear = forYear || year;
        forMonth = forMonth || (month - 1);
      }
    }
    
    setSalaryReceived(prev => ({
      ...prev,
      [date]: {
        amount, 
        date, 
        forMonth, 
        forYear, 
        receivedAt: new Date().toISOString()
      }
    }));
  };

  const getSalaryReceived = (date) => {
    return salaryReceived[date];
  };

  const getSalaryReceivedForMonth = (year, month) => {
    // Look for any salary received entry that corresponds to this month
    for (const [dateKey, salaryData] of Object.entries(salaryReceived)) {
      // Check if this salary payment is for the month we're looking for
      if (salaryData.forYear && salaryData.forMonth) {
        // Use the explicit forMonth and forYear if available (new format)
        if (salaryData.forYear === year && salaryData.forMonth === month) {
          return salaryData;
        }
      } else {
        // Fallback to old logic for existing data (before the update)
        const receivedDate = dateKey; // Format: '2082-04-15'
        const dateParts = receivedDate.split('-');
        if (dateParts.length >= 2) {
          const [receivedYear, receivedMonth] = dateParts.map(Number);
          
          // Assume salary for month X is received in month X+1
          let paymentForYear, paymentForMonth;
          if (receivedMonth === 1) {
            paymentForYear = receivedYear - 1;
            paymentForMonth = 12;
          } else {
            paymentForYear = receivedYear;
            paymentForMonth = receivedMonth - 1;
          }
          
          if (paymentForYear === year && paymentForMonth === month) {
            return salaryData;
          }
        }
      }
    }
    
    return null;
  };

  const removeSalaryReceived = (date) => {
    setSalaryReceived(prev => {
      const newData = {...prev};
      delete newData[date];
      return newData;
    });
  };

  // Export all data
  const exportData = async () => {
    const dataToExport = {
      attendance,
      monthlySalaries,
      salaryReceived,
      holidays,
    };
    return await exportAttendanceData(dataToExport);
  };

  // Import data and replace current data
  const importData = async () => {
    try {
      const importedData = await importAttendanceData();
      if (importedData) {
        // Validate and migrate the imported data
        const validatedData = validateAndMigrateData(importedData);
        
        // Update all state variables
        setAttendance(validatedData.attendance);
        setMonthlySalaries(validatedData.monthlySalaries);
        setSalaryReceived(validatedData.salaryReceived);
        setHolidays(validatedData.holidays);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Import error in context:', error);
      return false;
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendance,
        markAttendance,
        monthlySalaries,
        setSalaryForMonth,
        getSalaryForMonth,
        salaryReceived,
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
      }}>
      {children}
    </AttendanceContext.Provider>
  );
};