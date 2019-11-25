import React from 'react';
import PropTypes from 'prop-types';

const MonthDateHeader = ({ label }) => {
  return (
    <div>{label[0] === '0' ? label.slice(1) : label}</div>
  )
};

MonthDateHeader.propTypes = {
  label: PropTypes.string
}

export default MonthDateHeader;