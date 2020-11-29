// Copyleft 2020 Outright Mental

import React from "react";
import './Event.scss';

const Event = function (props) {
  let event = props.event;
  let date = event.start.dateTime ?
    new Date(event.start.dateTime) :
    new Date(event.start.date);
  let tMinusSeconds = Math.floor((date.getTime() - Date.now()) / 1000);
  return (
    <div className="agendar-event" key={event.id}>
      <div className="date-time">{date.toString()}</div>
      <div className="t-minus">{date.toString()} (T-{tMinusSeconds}s)</div>
      <div className="summary">{event.summary}</div>
    </div>
  );
}

export default Event;