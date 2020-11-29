// Copyleft 2020 Outright Mental

import {WEEK_DAYS} from "./_config";

export const fmtDate = (d) => {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${WEEK_DAYS[d.getDay()]}`;
}

export const fmtTime = (d) => {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

function pad2(num) {
  return num < 10 ? `0${num}` : `${num}`;
}
