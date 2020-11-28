// Copyleft 2020 Outright Mental

import React from "react";

const Event = function (props) {
  let event = props.event;
  let when = event.start.dateTime;
  if (!when) {
    when = event.start.date;
  }
  return (
    <div className="event" key={event.id}>{event.summary} ({when})</div>
  );
}

export default Event;