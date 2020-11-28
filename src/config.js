// Copyleft 2020 Outright Mental

// knobs
export const
  SECOND = 1000/* MILLISECOND */,
  MINUTE = 60 * SECOND,
  HOUR = 60 * MINUTE,
  DAY = 24 * HOUR,
  APP_INTERVAL_MILLIS = SECOND,
  CACHE_INVALIDATE_MILLIS = 15 * MINUTE,
  CALENDAR_FETCH_TO_FUTURE_MILLIS = DAY,
  CALENDAR_FETCH_ROWS_MAX = 99;

// secrets
export const
  GOOGLE_API_KEY = readMetaTag('REACT_APP_GOOGLE_API_KEY'),
  GOOGLE_CLIENT_ID = readMetaTag('REACT_APP_GOOGLE_CLIENT_ID'),
  GOOGLE_DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ],
  GOOGLE_SCOPE = [
    "https://www.googleapis.com/auth/calendar.events.readonly",
    "https://www.googleapis.com/auth/calendar.readonly",
  ].join(" "),
  GOOGLE_CLIENT_CONFIG = {
    apiKey: GOOGLE_API_KEY,
    clientId: GOOGLE_CLIENT_ID,
    discoveryDocs: GOOGLE_DISCOVERY_DOCS,
    scope: GOOGLE_SCOPE,
  };

function readMetaTag(name) {
  let el = document.head.querySelector(`[name=${name}][content]`);
  if (el && el.content) return el.content;
  console.error("Cannot retrieve value for META tag named", name);
  return "n/a";
}

