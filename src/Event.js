// Copyright (C) 2020 Outright Mental

import React from "react";
import './Event.scss';
import {fmtDateTime, fmtTimeUntil, fmtTodayTime} from "./_format";
import {
  EVENT_FAR_CLASS,
  EVENT_GO_CLASS,
  EVENT_GO_THRESHOLD,
  EVENT_NEAR_CLASS,
  EVENT_NEAR_THRESHOLD,
  EVENT_READY_CLASS,
  EVENT_READY_THRESHOLD,
  EVENT_STANDBY_CLASS,
  EVENT_STANDBY_THRESHOLD,
} from "./_config";

const Event = function (props) {
  let event = props.event;
  let use24Hour = props.use24Hour !== undefined ? props.use24Hour : true;
  let now = new Date();
  let startAt = event.start.dateTime ?
    new Date(event.start.dateTime) :
    new Date(event.start.date);
  let isToday = now.getDate() === startAt.getDate();
  return (
    <div className={`agendar-event ${computeStatusClass(startAt)}`} key={event.id}>
      <div className="header">
        <div className="t-minus">{fmtTimeUntil(startAt)}</div>
        <div className="date-time">{isToday ? fmtTodayTime(startAt, use24Hour) : fmtDateTime(startAt, use24Hour)}</div>
      </div>
      <div className="info">
        <div className="summary">{event.summary}</div>
      </div>
    </div>
  );
}

function computeStatusClass(d) {
  let millis = d.getTime() - Date.now();
  if (millis < EVENT_GO_THRESHOLD) return EVENT_GO_CLASS;
  if (millis < EVENT_READY_THRESHOLD) return EVENT_READY_CLASS;
  if (millis < EVENT_STANDBY_THRESHOLD) return EVENT_STANDBY_CLASS;
  if (millis < EVENT_NEAR_THRESHOLD) return EVENT_NEAR_CLASS;
  return EVENT_FAR_CLASS;
}

export default Event;