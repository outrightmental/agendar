// Copyleft 2020 Outright Mental

import React from "react";
import './Event.scss';

const Event = function (props) {
  let event = props.event;
  let when = event.start.dateTime;
  if (!when) {
    when = event.start.date;
  }
  return (
    <div className="agendar-event" key={event.id}>
      <div className="time">{when}</div>
      <div className="summary">{event.summary}</div>
    </div>
  );
}

export default Event;