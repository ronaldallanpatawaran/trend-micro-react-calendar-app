import React from 'react'
import styles from './App.module.css'
import CalendarInput from './components/common/input-calendar'

function App () {
  return (
    <div className={styles.container}>
      <h1>A simple reactjs calendar picker</h1>
      <CalendarInput/>
    </div>
  )
}

export default App
