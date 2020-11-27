export const

  GOOGLE_API_KEY =
    // 'AIzaSyDMeOHdQ7sRjWwmK4pXBsL8KPDXYXEyOdw', //Production
    'AIzaSyDGMNlKWChcdRnm06FaAPl5qSJzM8_9XFY', // Development

  GOOGLE_CLIENT_ID =
    // '716546716200-k27gns7n7emjglrn2bec5jui3323r0ua.apps.googleusercontent.com', // Production
    '307271403290-nirg6c5afjm47qtlloufj0kgrfd05ui7.apps.googleusercontent.com', // Development

  GOOGLE_SCOPE = [
    "https://www.googleapis.com/auth/calendar.events.readonly",
    "https://www.googleapis.com/auth/calendar.readonly",
  ].join(" "),

  GOOGLE_DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ],

  GOOGLE_CLIENT_CONFIG = {
    apiKey: GOOGLE_API_KEY,
    clientId: GOOGLE_CLIENT_ID,
    discoveryDocs: GOOGLE_DISCOVERY_DOCS,
    scope: GOOGLE_SCOPE,
  },

  BEAT_INTERVAL_MILLIS = 1000, // once per second, like a clock

  CACHE_INVALIDATE_MILLIS = 1000 * 60 * 60,

  CALENDAR_FETCH_ROWS_MAX = 999;
