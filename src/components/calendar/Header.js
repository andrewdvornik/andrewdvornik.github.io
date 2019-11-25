import React from 'react';
import PropTypes from 'prop-types';

import './Header.scss';

const Header = (header) => {
  return (
    <div className="calendar-header">{header.label.toUpperCase()}</div>
  )
};

Header.propTypes = {
  header: PropTypes.object
}

export default Header;