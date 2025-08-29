// BS Calendar data with days in each month for different years
const bsMonthData = {
  2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2084: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2085: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2086: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2087: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2088: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2090: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
};

// Starting AD date for BS 2082-01-01
const bsStartDate = {
  year: 2082,
  month: 1,
  day: 1,
  adDate: '2025-04-14' // BS 2082-01-01 corresponds to AD 2025-04-14
};

export const getBSDaysInMonth = (year, month) => {
  if (bsMonthData[year] && bsMonthData[year][month - 1]) {
    return bsMonthData[year][month - 1];
  }
  // Fallback for years not in data
  return 30;
};

export const getBSWeekday = (bsDate) => {
  try {
    const [year, month, day] = bsDate.split("-").map(Number);
    const adDate = convertBStoAD(year, month, day);
    return new Date(adDate).getDay();
  } catch (e) {
    console.error("Error getting BS weekday:", e);
    return 0; // Fallback to Sunday
  }
};

export const getBSMonthDates = (year, month) => {
  const days = getBSDaysInMonth(year, month);
  return Array.from(
    { length: days },
    (_, i) =>
      `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(
        2,
        "0"
      )}`
  );
};

export const convertBStoAD = (bsYear, bsMonth, bsDay) => {
  try {
    // Calculate total days from BS start date to target date
    let totalDays = 0;
    
    // Add days for complete years
    for (let year = bsStartDate.year; year < bsYear; year++) {
      if (bsMonthData[year]) {
        totalDays += bsMonthData[year].reduce((sum, days) => sum + days, 0);
      } else {
        totalDays += 365; // Fallback
      }
    }
    
    // Add days for complete months in target year
    for (let month = 1; month < bsMonth; month++) {
      totalDays += getBSDaysInMonth(bsYear, month);
    }
    
    // Add remaining days
    totalDays += bsDay - 1;
    
    // Calculate AD date
    const startAD = new Date(bsStartDate.adDate);
    const targetAD = new Date(startAD);
    targetAD.setDate(startAD.getDate() + totalDays);
    
    return targetAD.toISOString().split('T')[0];
  } catch (e) {
    console.error("Error converting BS to AD:", e);
    return new Date().toISOString().split('T')[0];
  }
};

export const convertADtoBS = (adDateString) => {
  try {
    const adDate = new Date(adDateString);
    const startAD = new Date(bsStartDate.adDate);
    
    // Calculate days difference
    const timeDiff = adDate.getTime() - startAD.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      // Date is before our reference point
      return { year: 2082, month: 1, day: 1 };
    }
    
    let remainingDays = daysDiff;
    let currentYear = bsStartDate.year;
    let currentMonth = bsStartDate.month;
    let currentDay = bsStartDate.day;
    
    // Add the remaining days from the first day
    remainingDays += currentDay - 1;
    currentDay = 1;
    
    // Move through years
    while (remainingDays > 0) {
      // Check if we can complete the current year
      let daysInCurrentYear = 0;
      if (bsMonthData[currentYear]) {
        daysInCurrentYear = bsMonthData[currentYear].reduce((sum, days) => sum + days, 0);
      } else {
        daysInCurrentYear = 365; // Fallback
      }
      
      // Calculate remaining days in current year from current month
      let remainingDaysInYear = 0;
      for (let month = currentMonth; month <= 12; month++) {
        remainingDaysInYear += getBSDaysInMonth(currentYear, month);
      }
      
      if (remainingDays >= remainingDaysInYear) {
        remainingDays -= remainingDaysInYear;
        currentYear++;
        currentMonth = 1;
      } else {
        break;
      }
    }
    
    // Move through months
    while (remainingDays > 0) {
      const daysInMonth = getBSDaysInMonth(currentYear, currentMonth);
      
      if (remainingDays >= daysInMonth) {
        remainingDays -= daysInMonth;
        currentMonth++;
        if (currentMonth > 12) {
          currentMonth = 1;
          currentYear++;
        }
      } else {
        break;
      }
    }
    
    // Set the final day
    currentDay = remainingDays + 1;
    
    return {
      year: currentYear,
      month: currentMonth,
      day: currentDay
    };
  } catch (e) {
    console.error("Error converting AD to BS:", e);
    // Fallback to a reasonable default
    return { year: 2082, month: 5, day: 12 };
  }
};

export const getCurrentBSDate = () => {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  return convertADtoBS(todayString);
};

export const getTodayBSString = () => {
  const current = getCurrentBSDate();
  return `${current.year}-${String(current.month).padStart(2, '0')}-${String(current.day).padStart(2, '0')}`;
};

export const getBSMonthName = (month) => {
  const monthNames = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];
  return monthNames[month - 1] || `Month ${month}`;
};