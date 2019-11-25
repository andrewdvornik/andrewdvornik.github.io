import React from 'react';
import MyCalendar from '../calendar/Calendar';

import './App.scss';

function App() {
  return (
    <div className="app-container">
      <div className="app-content">
        <div className="app-header ">Calendar</div>
        <div className="calendar-wrapper">
          <MyCalendar />
        </div>
      </div>

    </div>
  )
}

export default App;
