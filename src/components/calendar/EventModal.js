import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";
import { GithubPicker } from 'react-color';
import moment from 'moment';
import colors from './utils/colors';
import { DEFAULT_EVENT_COLOR } from './utils/constants';

import "../../../node_modules/react-datepicker/dist/react-datepicker.css";
import './EventModal.scss';

function allDayCondition(event) {
  if (!event || (event && event.end && event.allDay)) return null;
  return event.end;
}

class EventModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      event: {
        id: !props.event && props.eventsLength > 0 ? props.eventsLength : 0,
        title: props.event ? props.event.title : '',
        start: props.event ? props.event.start : null,
        end: allDayCondition(props.event),
        desc: props.event ? props.event.desc : '',
        color: props.event ? props.event.color : DEFAULT_EVENT_COLOR
      },
      errors: {},
      showColorPicker: false
    };
  }

  changeEventFieldValue = field => e => {
    const event = {...this.state.event};
    const errors = {...this.state.errors};
    event[field] = e.target.value;
    delete errors[field];
    this.setState({ event, errors });
  };

  changeDate = date => {
    const event = {...this.state.event};
    const errors = {...this.state.errors};
    event.start = date;
    if (date && errors.start) {
      delete errors.start;
    }
    this.setState({ event, errors });
  }

  changeTime = field => date => {
    const event = {...this.state.event};
    const errors = {...this.state.errors};
    event[field] = date;

    if (event.start && event.end) {
      event.end = new Date(moment(event.end).date(moment(event.start).get('date')));
      if (moment(event.end).isBefore(event.start)) {
        errors.end = true;
        return false;
      }
    };

    if (event.end && errors.end) {
      delete errors.end;
    }

    this.setState({ event, errors });
  }

  showHideColorPicker = () => {
    this.setState({ showColorPicker: !this.state.showColorPicker });
  }

  changeColor = (color) => {
    const event = {...this.state.event};
    event.color = color.hex;
    this.setState({ showColorPicker: false, event });
  }

  validateForm = () => {
    const event = {...this.state.event};
    const errors = {};
    const fields = ['title', 'start', 'desc'];

    for (let field of fields) {
      if (((field === 'title'|| field === 'desc') && !event[field].trim()) || !event[field]) {
        errors[field] = true;
      }
    }

    this.setState({ errors });

    return Object.keys(errors).length;
  }

  saveForm = () => {
    if (this.validateForm() > 0) {
      return false;
    }

    const eventCopy = { ...this.state.event };
    if (!eventCopy.end) {
      eventCopy.end = eventCopy.start;
      eventCopy.allDay = true;
    }

    const action = this.props.event ? 'updateEvent' : 'createEvent';

    this.props[action](eventCopy);
  }

  render() {
    const { top, left } = this.props.modalCoordinates;
    
    return (
      <div className="modal-container" style={{ top: `${top}px`, left: `${left}px` }} >
        <div className="close-icon-wrapper">
          <div className="close-icon" onClick={this.props.closeModal}>
            <div className="close-symbol">&#10005;</div>
          </div>
        </div>
        <div className="inputs-wrapper">
          <div className="input-block">
            <div className="input-label">event name</div>
            <input
              maxLength={30}
              className={`modal-input ${this.state.errors.title ? 'error' : null}`}
              type="text" value={this.state.event.title}
              onChange={this.changeEventFieldValue('title')}
            />
          </div>
          <div className="input-block">
            <div className="input-label">event date</div>
            <DatePicker
              selected={this.state.event.start}
              onChange={this.changeDate}
              className={`modal-input ${this.state.errors.start ? 'error' : null}`}
            />
          </div>
          <div className="input-block">
            <div className="input-label">event start time</div>
            <DatePicker
              selected={this.state.event.start}
              onChange={this.changeTime('start')}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              className={`modal-input ${this.state.errors.start ? 'error' : null}`}
            />
          </div>
          <div className="input-block">
            <div className="input-label">event end time</div>
            <DatePicker
              selected={this.state.event.end}
              onChange={this.changeTime('end')}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              className="modal-input"
            />
          </div>
          <div className="input-block">
            <div className="input-label">notes</div>
            <input
              className={`modal-input small ${this.state.errors.desc ? 'error' : null}`}
              type="text" value={this.state.event.desc}
              onChange={this.changeEventFieldValue('desc')}
            />
          </div>
          <div className="input-block">
            <div className="color-box" style={{
              backgroundColor: this.state.event.color,
              border: `1px solid #D6D6D6`
            }}
              onClick={this.showHideColorPicker}>
              <div className="color-picker-wrapper">
                {
                  this.state.showColorPicker &&
                  <GithubPicker
                    color={this.state.event.color}
                    colors={colors}
                    width={154}
                    onChangeComplete={this.changeColor}
                  />
                }
              </div>
            </div>

          </div>
        </div>
        <div className="buttons-wrapper">
          {
            this.props.event ?
              <div className="modal-btn cancel" onClick={() => this.props.deleteEvent(this.props.event)}>DISCARD</div> :
              <div className="modal-btn cancel" onClick={this.props.closeModal}>Cancel</div>
          }
          <div className="modal-btn" onClick={this.saveForm}>{this.props.event ? 'EDIT' : 'Save'}</div>
        </div>
      </div>
    )
  }
};

EventModal.propTypes = {
  eventsLength: PropTypes.number,
  event: PropTypes.object,
  createEvent: PropTypes.func,
  updateEvent: PropTypes.func,
  deleteEvent: PropTypes.func,
  closeModal: PropTypes.func,
  modalCoordinates: PropTypes.object
}

export default EventModal;