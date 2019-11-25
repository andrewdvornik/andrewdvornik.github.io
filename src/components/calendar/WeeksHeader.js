import React from 'react';
import PropTypes from 'prop-types';
import { weekDayNames } from './utils/dateHelper';

import './WeeksHeader.scss';

const WeeksHeader = (header) => {
  const day = `${weekDayNames[header.date.getDay()].slice(0, 3)}`;
  let date = header.date.getDate();
  if (date < 10) date = '0' + date;
  let month = header.date.getMonth() + 1;
  if (month < 10) month = '0' + month;

  return (
    <div className="weeks-header">{`${day} ${date}/${month}`}</div>
  );
};

WeeksHeader.propTypes = {
  header: PropTypes.object
}

export default WeeksHeader;