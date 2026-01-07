// Copyright (C) 2020 Outright Mental

import {DAY, EVENT_GO_THRESHOLD, HOUR, MINUTE} from "./_config";

const
  WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
  WEEK_TODAY = 'TODAY',
  TIME_NOW = 'NOW',
  TIME_IN = 'IN',
  TIME_LESS_THAN = 'LESS THAN',
  TIME_DAY = 'DAY',
  TIME_DAYS = 'DAYS',
  TIME_HOUR = 'HOUR',
  TIME_HOURS = 'HOURS',
  TIME_MINUTE = 'MINUTE',
  TIME_MINUTES = 'MINUTES';

export const fmtDateTime = (d, use24Hour = true) => {
  return `${fmtDate(d)} ${fmtTime(d, use24Hour)}`;
}

export const fmtTodayTime = (d, use24Hour = true) => {
  return `${WEEK_TODAY} ${fmtTime(d, use24Hour)}`;
}

export const fmtDate = (d) => {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${WEEK_DAYS[d.getDay()]}`;
}

export const fmtTime = (d, use24Hour = true) => {
  if (use24Hour) {
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  } else {
    const hours = d.getHours();
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())} ${period}`;
  }
}

export const fmtTimeUntil = (d) => {
  let m = d.getTime() - Date.now();
  if (m > 2 * DAY) return `${TIME_IN} ${Math.floor(m / DAY)} ${TIME_DAYS}`
  if (m > DAY) return `${TIME_IN} ${Math.floor(m / DAY)} ${TIME_DAY}`
  if (m > 2 * HOUR) return `${TIME_IN} ${Math.floor(m / HOUR)} ${TIME_HOURS}`
  if (m > HOUR) return `${TIME_IN} ${Math.floor(m / HOUR)} ${TIME_HOUR}`
  if (m > 2 * MINUTE) return `${TIME_IN} ${Math.floor(m / MINUTE)} ${TIME_MINUTES}`
  if (m > MINUTE) return `${TIME_IN} ${Math.floor(m / MINUTE)} ${TIME_MINUTE}`
  if (m > EVENT_GO_THRESHOLD) return `${TIME_LESS_THAN} 1 ${TIME_MINUTE}`
  return TIME_NOW;
}

// ----------------- private below here ----------------- //

function pad2(num) {
  return num < 10 ? `0${num}` : `${num}`;
}
