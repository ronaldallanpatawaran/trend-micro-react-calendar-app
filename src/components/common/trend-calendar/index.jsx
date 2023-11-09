import React, { useEffect, useState } from 'react';
import styles from "./style.module.css";
import classnames from 'classnames';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const maxRows = 6;
const maximumCalendarCells = maxRows * daysOfWeek.length;
const date = new Date();
const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

const TrendCalendar = (props) => {
  const {
    onChange,
    date,
  } = props;
  const [year, month, day] = date.split('-');
  
  const [inputtedDate, setInputtedDate] = useState(date ? new Date(year, month - 1, day) : currentDate);
  const [currentTypeOfSelection, setCurrentTypeOfSelection] = useState('days');
  const [currentYear, setCurrentYear] = useState(year ? parseInt(year) : new Date().getFullYear());
  const [calendarGridClass, setCalendarGridClass] = useState(styles.calendar_grid);
  const [selectedDate, setSelectedDate] = useState(inputtedDate);
  const [currentDecade, setCurrentDecade] = useState();

  const prevCurrentDate = new Date(inputtedDate.getFullYear(), inputtedDate.getMonth() - 1, 0);
  
  const numberOfDaysCurrentMonth = new Date(
    inputtedDate.getFullYear(),
    inputtedDate.getMonth() + 1,
    0
  ).getDate();

  const numberOfDaysPrevMonth = new Date(
    inputtedDate.getFullYear(),
    inputtedDate.getMonth(),
    0
  ).getDate();

  const numberOfDaysBeforeTheCurrentMonth = new Date(
    inputtedDate.getFullYear(),
    inputtedDate.getMonth(),
    0
  ).getDay() + 1;

  const numberOfDaysNextMonth = new Date(
    inputtedDate.getFullYear(),
    inputtedDate.getMonth() + 2,
    0
  ).getDate();


  const renderCalendarInDays = () => {
    const calendar = [];

    // Days before the current date
    if (numberOfDaysPrevMonth > 0) {
      for (let day = (numberOfDaysPrevMonth - numberOfDaysBeforeTheCurrentMonth ) + 1; day <= numberOfDaysPrevMonth; day++) {
        const _currentDate = new Date(inputtedDate.getFullYear(), inputtedDate.getMonth() - 1, day);
        calendar.push(
          <div
            key={`prev-${day}`}
            onClick={() => handleSelectDate(new Date(inputtedDate.getFullYear(), inputtedDate.getMonth() - 1, day))}
            className={classnames(
              styles.calendar_cell,
              styles.outside_of_current_month,
              selectedDate && selectedDate.getTime() === _currentDate.getTime() ? styles.selected_date : '',
              selectedDate && selectedDate.getTime() !== _currentDate.getTime() && _currentDate.getTime() === currentDate.getTime() ? styles.current_date : '')}>
            <span>{day}</span>
          </div>);
      }
    }

    // Days of the current date
    for (let day = 1; day <= numberOfDaysCurrentMonth; day++) {
      const _currentDate = new Date(inputtedDate.getFullYear(), inputtedDate.getMonth(), day);
      calendar.push(
        <div
          key={day}
          onClick={() => handleSelectDate(new Date(inputtedDate.getFullYear(), inputtedDate.getMonth(), day))}
          className={classnames(
            styles.calendar_cell,
            selectedDate && selectedDate.getTime() === _currentDate.getTime() ? styles.selected_date : '',
            selectedDate && selectedDate.getTime() !== _currentDate.getTime() && _currentDate.getTime() === currentDate.getTime() ? styles.current_date : '')}>
          <span>{day}</span>
        </div>
      );
    }

    // Days after the current date
    if (maximumCalendarCells - (numberOfDaysCurrentMonth + numberOfDaysBeforeTheCurrentMonth) > 0) {
      for (let day = 1; day <= (maximumCalendarCells - (numberOfDaysCurrentMonth + numberOfDaysBeforeTheCurrentMonth)); day++) {
        const _currentDate = new Date(inputtedDate.getFullYear(), inputtedDate.getMonth() + 1, day);
        calendar.push(
          <div
            key={`next-${day}`}
            onClick={() => handleSelectDate(new Date(inputtedDate.getFullYear(), inputtedDate.getMonth() + 1, day))}
            className={classnames(
              styles.calendar_cell, styles.outside_of_current_month,
              selectedDate && selectedDate.getTime() === _currentDate.getTime() ? styles.selected_date : '',
              selectedDate && selectedDate.getTime() !== _currentDate.getTime() && _currentDate.getTime() === currentDate.getTime() ? styles.current_date : '')}>
            <span>{day}</span>
          </div>
        );
      }
    }

    return calendar;
  };

  const generateYears = (startYear, endYear) => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return groupYearsIntoDecades(years);
  }

  const groupYearsIntoDecades = (years) => {
    const groupedDecades = {};
  
    years.forEach((year) => {
      const decade = Math.floor(year / 10) * 10; // Calculate the decade (e.g., 1985 -> 1980)
      if (!groupedDecades[decade]) {
        groupedDecades[decade] = [];
      }
      groupedDecades[decade].push(year);
    });
  
    return groupedDecades;
  }

  const getCurrentDecade = (year) => {
    const currentYear = year ? year : new Date().getFullYear();
    const decadeStartYear = Math.floor(currentYear / 10) * 10;
    return `${decadeStartYear}-${decadeStartYear + 9}`;
  }

  const renderCalendarInYears = () => {
    const years = [];
    const yearsPerDecade = generateYears(1900, new Date().getFullYear() + 100);
    const yearBeforeCurrentDecade = yearsPerDecade[currentDecade.split('-')[0]][0] - 1;
    const yearAfterCurrentDecade = yearsPerDecade[currentDecade.split('-')[0]][yearsPerDecade[currentDecade.split('-')[0]].length - 1] + 1;

    years.push(
      <div
        onClick={()=>handleSelectYear(yearBeforeCurrentDecade)}
        key={yearBeforeCurrentDecade}
        className={classnames(styles.calendar_cell, styles.outside_of_current_month, currentYear === yearBeforeCurrentDecade ? styles.selected_year : '')}>
        <span>{yearBeforeCurrentDecade}</span>
      </div>
    );

    yearsPerDecade[currentDecade.split('-')[0]].forEach(year => {
      years.push(
        <div
          onClick={()=>handleSelectYear(year)}
          key={year} 
          className={classnames(styles.calendar_cell, currentYear === year ? styles.selected_year : '')}>
          <span>{year}</span>
        </div>
      );
    });

    years.push(
      <div
        onClick={()=>handleSelectYear(yearAfterCurrentDecade)}
        key={yearAfterCurrentDecade}
        className={classnames(styles.calendar_cell, styles.outside_of_current_month, currentYear === yearAfterCurrentDecade ? styles.selected_year : '')}>
        <span>{yearAfterCurrentDecade}</span>
      </div>
    );

    return years;
  };

  const renderCalendarInMonths = () => {
    const months = [];
    const selectedMonth = selectedDate.getMonth();

    monthsOfYear.forEach((month) => {
      months.push(
        <div
          key={month}
          onClick={() => handleSelectMonth(month)}
          className={classnames(
            styles.calendar_cell,
            selectedMonth === monthsOfYear.indexOf(month) ? styles.selected_date : ''
            )}>
          {month}
        </div>
      );
    });

    return months;
  };

  const renderCalendarHeader = () => {
    switch (currentTypeOfSelection) {
      case 'days':
        return (
          <>
            <h3 onClick={handleSelectHeader}>
              {inputtedDate.toLocaleString('default', { month: 'long' })}{' '}
              {inputtedDate.getFullYear()}
            </h3>
          </>
        );
      case 'months':
        return (
          <>
            <h3 onClick={handleSelectHeader}>
              {currentYear}
            </h3>
          </>
        );
      case 'years':
        return (
          <>
            <h3 onClick={handleSelectHeader}>
              {currentDecade}
            </h3>
          </>
        );
    }
  };

  const handlePrevSelect = () => {
    switch (currentTypeOfSelection) {
      case 'days':
        setInputtedDate(new Date(inputtedDate.getFullYear(), inputtedDate.getMonth() - 1, 1));
        setSelectedDate(currentDate); // reset the selected date to current
        break;
      
      case 'months':
        // change months
        setCurrentYear(currentYear-1);
        break;
      case 'years':
        // change decades
        const splittedCurrentDecade = currentDecade.split('-');
        const firstYear = splittedCurrentDecade[0];
        const lastYear = splittedCurrentDecade[splittedCurrentDecade.length - 1];
        setCurrentDecade(`${parseInt(firstYear) - 10}-${parseInt(lastYear) - 10}`);
        break;
    
      default:
        break;
    }
  };

  const handleNextSelect = () => {
    switch (currentTypeOfSelection) {
      case 'days':
        setInputtedDate(new Date(inputtedDate.getFullYear(), inputtedDate.getMonth() + 1, 1));
        setSelectedDate(currentDate); // reset the selected date to current
        break;
      
      case 'months':
        // change months
        setCurrentYear(currentYear+1);
        break;
      case 'years':
        // change decades
        const splittedCurrentDecade = currentDecade.split('-');
        const firstYear = splittedCurrentDecade[0];
        const lastYear = splittedCurrentDecade[splittedCurrentDecade.length - 1];
        setCurrentDecade(`${parseInt(firstYear) + 10}-${parseInt(lastYear) + 10}`);
        break;
    
      default:
        break;
    }
  };

  const handleSelectHeader = () => {
    if (currentTypeOfSelection === 'days') {
      setCurrentTypeOfSelection("months");
      setCalendarGridClass(styles.calendar_month_grid);
    } else if (currentTypeOfSelection === 'months') {
      setCurrentTypeOfSelection("years");
      setCalendarGridClass(styles.calendar_year_grid);
    } else {
      setCurrentTypeOfSelection("days");
      setCalendarGridClass(styles.calendar_grid);
    }
  };

  const handleSelectDate = (selectedDate) => {
    setSelectedDate(selectedDate);
    onChange({ target: { value: selectedDate } });
  }

  const handleSelectMonth = (selectedMonth) => {
    setInputtedDate(new Date(currentYear, monthsOfYear.indexOf(selectedMonth)));
    setCurrentTypeOfSelection('days');
    setCalendarGridClass(styles.calendar_grid);
  };

  const handleSelectYear = (selectedYear) => {
    setCurrentYear(selectedYear);
    setInputtedDate(new Date(selectedYear, inputtedDate.getMonth(), 1));
    setCurrentTypeOfSelection('months');
    setCalendarGridClass(styles.calendar_month_grid);
  };

  useEffect(() => {
    setCurrentDecade(getCurrentDecade(selectedDate.getFullYear()));
  }, [selectedDate]);

  useEffect(() => {

    if (isDateValid(date)) {
      const [year, month, day] = date.split('-');
      setInputtedDate(date ? new Date(year, month - 1, day) : currentDate);
      setCurrentTypeOfSelection('days');
      setCurrentYear(year ? parseInt(year) : new Date().getFullYear());
      setCalendarGridClass(styles.calendar_grid);
      setSelectedDate(date ? new Date(year, month - 1, day) : currentDate);
    }

  }, [date]);

  return (
    <div className={styles.calendar} >
      <div className={styles.calendar_header}>
        <button onClick={handlePrevSelect}>&lt;</button>
          {renderCalendarHeader()}
        <button onClick={handleNextSelect}>&gt;</button> 
      </div>
      <div className={calendarGridClass}>
        {currentTypeOfSelection === 'days' && daysOfWeek.map((day) => (
          <div key={day} className={classnames(styles.calendar_cell, styles.day_of_the_week)}>
            {day}
          </div>
        ))}
        {currentTypeOfSelection === 'days' && renderCalendarInDays()}
        {currentTypeOfSelection === 'months' && renderCalendarInMonths()}
        {currentTypeOfSelection === 'years' && renderCalendarInYears()}
      </div>
    </div>
  );
};

function isDateValid(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}


export default TrendCalendar;
