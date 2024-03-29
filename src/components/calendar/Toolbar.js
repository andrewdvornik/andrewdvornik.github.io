import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { monthNames } from './utils/dateHelper';

import './Toolbar.scss';

const Toolbar = (toolbar) => {
  const [activeNav, setActiveNav] = useState('today');

  const goToBack = () => {
    switch (toolbar.view) {
      case 'week':
        toolbar.date.setDate(toolbar.date.getDate() - 7);
        break;
      case 'day':
        toolbar.date.setDate(toolbar.date.getDate() - 1);
        break;
      default:
        toolbar.date.setMonth(toolbar.date.getMonth() - 1);
    }

    toolbar.onNavigate('prev');
    setActiveNav('back');
  };

  const goToNext = () => {
    switch (toolbar.view) {
      case 'week':
        toolbar.date.setDate(toolbar.date.getDate() + 7);
        break;
      case 'day':
        toolbar.date.setDate(toolbar.date.getDate() + 1);
        break;
      default:
        toolbar.date.setMonth(toolbar.date.getMonth() + 1);
    }

    toolbar.onNavigate('next');
    setActiveNav('next');
  };

  const goToCurrent = () => {
    const now = new Date();
    toolbar.date.setDate(now.getDate());
    toolbar.date.setMonth(now.getMonth());
    toolbar.date.setYear(now.getFullYear());
    toolbar.onNavigate('current');
    setActiveNav('today');
  };

  const setView = view => () => {
    toolbar.onView(view);
  };

  const returnActiveNavClass = (type) => activeNav === type ? 'active' : '';

  const returnActiveViewClass = (type) => toolbar.view === type ? 'active' : '';

  const returnViewLabel = () => {
    let label = '';

    switch (toolbar.view) {
      case 'week':
        let splittedStr = toolbar.label.split(' ');
        label = `${splittedStr[0].slice(0, 3)} ${splittedStr[1]} - ${splittedStr[0].slice(0, 3)} ${splittedStr[3]}`
        break;
      case 'day':
        label = toolbar.label;
        break;
      default:
        label = `${monthNames[toolbar.date.getMonth()]} ${toolbar.date.getFullYear()}`
    }
    return label;
  }

  return (
    <div className="toolbar-container">
      <div className="toolbar-section">
        <div className="toolbar-title">Calendar view</div>
        <div className="toolbar-btn-block">
          <div className={`toolbar-btn left ${returnActiveViewClass('month')}`} onClick={setView('month')}>Month</div>
          <div className={`toolbar-btn ${returnActiveViewClass('week')}`} onClick={setView('week')}>Week</div>
          <div className={`toolbar-btn right ${returnActiveViewClass('day')}`} onClick={setView('day')}>Day</div>
        </div>
      </div>
      <div className="toolbar-bottom">
        <div className="toolbar-section bottom">
          <div className="toolbar-btn-block">
            <div className={`toolbar-btn left ${returnActiveNavClass('today')}`} onClick={goToCurrent}>Today</div>
            <div className={`toolbar-btn ${returnActiveNavClass('back')}`} onClick={goToBack}>Back</div>
            <div className={`toolbar-btn right ${returnActiveNavClass('next')}`} onClick={goToNext}>Next</div>
          </div>
          <div className="toolbar-label">{returnViewLabel()}</div>
        </div>
      </div>
    </div >
  );
};

Toolbar.propTypes = {
  toolbar: PropTypes.object
}

export default Toolbar;
