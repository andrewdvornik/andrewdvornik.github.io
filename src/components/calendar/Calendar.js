import React, { Fragment } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import Toolbar from './Toolbar';
import Header from './Header';
import WeeksHeader from './WeeksHeader';
import MonthDateHeader from './MonthDateHeader';
import Event from './Event';
import EventModal from './EventModal';
import TimeGlutterHeader from './TimeGlutterHeader';
import { MODAL_HEIGHT, CALENDAR_HEIGHT } from './utils/constants';

import './Calendar.scss';
import 'react-big-calendar/lib/sass/styles.scss';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss';

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);


class MyCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      eventModalIsOpen: false,
      modalCoordinates: { top: 0, left: 0 },
      event: null,
    };
  }

  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const { events } = this.state;

    const idx = events.indexOf(event);
    let allDay = event.allDay;

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }

    const updatedEvent = { ...event, start, end, allDay };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    this.setState({
      events: nextEvents,
    });
  }

  selectSlot = (event) => {
    if (this.state.eventModalIsOpen === true || !event.box) {
      return false;
    }

    let top = this.returnModalTopValue(event.box.y);

    this.setState({
      eventModalIsOpen: true,
      event: null,
      modalCoordinates: { top, left: event.box.x }
    });
  }

  selectEvent = (event) => {
    if (this.state.eventModalIsOpen === true) {
      return false;
    }

    this.setState({ eventModalIsOpen: true, event });
  }

  calculateCoordinatesForModal = e => {
    if (this.state.eventModalIsOpen === true) {
      return false;
    }

    e.persist();

    let top = this.returnModalTopValue(e.pageY);

    this.setState({ modalCoordinates: { top, left: Math.floor(e.pageX) } })
  }

  returnModalTopValue = y => {
    if (document.body.clientHeight - Math.floor(y) < MODAL_HEIGHT) {
      return y -= MODAL_HEIGHT;
    }
    return y;
  }

  createEvent = event => {
    const events = [...this.state.events];
    events.push(event);
    this.setState({ events, ...this.setModalDefaults() });
  }

  updateEvent = event => {
    let events = [...this.state.events];
    events = events.map(ev => {
      if (ev.id === event.id) {
        ev = event;
      }
      return ev;
    });
    this.setState({ events, ...this.setModalDefaults() });
  }

  deleteEvent = event => {
    let events = [...this.state.events];
    events = events.filter(ev => ev.id !== event.id);
    this.setState({ events, ...this.setModalDefaults() });
  }

  closeModal = () => {
    this.setState({
      eventModalIsOpen: false,
      ...this.setModalDefaults(),
      modalCoordinates: { top: 0, left: 0 }
    });
  }

  setModalDefaults = () => {
    return { eventModalIsOpen: false, event: null }
  }

  eventPropGetter = (event, start, end, isSelected) => {
    return { style: { backgroundColor: event.color } }
  }

  render() {
    return (
      <Fragment>
        <DragAndDropCalendar
          selectable
          resizable={false}
          localizer={localizer}
          defaultView={Views.MONTH}
          defaultDate={new Date()}
          startAccessor="start"
          endAccessor="end"
          allDayAccessor={'allDay'}
          tooltipAccessor={this.tooltipAccessor}
          step={60}
          style={{ height: CALENDAR_HEIGHT }}
          events={this.state.events}
          onSelectSlot={this.selectSlot}
          onSelectEvent={this.selectEvent}
          onEventResize={() => { }}
          onEventDrop={this.moveEvent}
          components={{
            event: (event) => <Event eventClickHandler={this.calculateCoordinatesForModal} event={event} />,
            toolbar: Toolbar,
            timeGutterHeader: TimeGlutterHeader,
            month: {
              header: Header,
              dateHeader: MonthDateHeader
            },
            week: {
              header: WeeksHeader
            }
          }}
          eventPropGetter={this.eventPropGetter}
        />
        {this.state.eventModalIsOpen &&
          <EventModal
            eventsLength={this.state.events.length}
            event={this.state.event}
            modalCoordinates={this.state.modalCoordinates}
            createEvent={this.createEvent}
            updateEvent={this.updateEvent}
            deleteEvent={this.deleteEvent}
            closeModal={this.closeModal}
          />}
      </Fragment>
    )
  }
}

export default MyCalendar;