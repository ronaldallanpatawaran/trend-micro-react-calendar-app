import React, { useEffect, useState, useRef } from 'react';
import TrendCalendar from '../trend-calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import styles from "./style.module.css";

const CalendarInput = () => {
  const [selectedDate, setSelectedDate] = useState(getIsoString(new Date()));
  const [showCalendar, setShowCalendar] = useState(false);

  const handleOnChange = (event) => {
    setShowCalendar(false);
    setSelectedDate(getIsoString(event.target.value));
  }

  const handleDateInput = (event) => {
    setShowCalendar(false);
    setSelectedDate(event.target.value);
    setShowCalendar(true);
  }

  const handleKeyEnter = (event) => {
    if (event.keyCode === 13 && event.code === "Enter") {
      setShowCalendar(false);
    }
  }

  return (
    <>
      <div>
        <div className={styles.input_container} >
          <FontAwesomeIcon icon={faCalendar} className={styles.calendar_icon} />
          <input type="text" placeholder="Select a date" value={selectedDate} onChange={handleDateInput} onClick={() => setShowCalendar(!showCalendar)} onKeyDown={handleKeyEnter} />
        </div>
        <div className='calendar-container'>
          {showCalendar && <TrendCalendar onChange={handleOnChange} date={selectedDate} />}
        </div>
      </div>
    </>
  );
};

function getIsoString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const isoDateString = `${year}-${month}-${day}`;

  return isoDateString;
}

export default CalendarInput;
