import React from 'react';
import PropTypes from 'prop-types';

import './Event.scss';

const Event = ({event, eventClickHandler}) => {
  return (
    <div className="calendar-event" onClick={e => eventClickHandler(e)}>{event.title}</div>
  )
};

Event.propTypes = {
  event: PropTypes.object,
  eventClickHandler: PropTypes.func
}

export default Event;