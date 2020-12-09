/*
 * Copyright (c) Outright Mental. (https://outrightmental.com) All Rights Reserved.
 */

/* global gapi */

// app
import {produce} from "immer";
import {createSelector} from "reselect";
import {
  APP_INTERVAL_MILLIS,
  CACHE_INVALIDATE_MILLIS,
  CALENDAR_FETCH_ROWS_MAX,
  CALENDAR_FETCH_TO_FUTURE_MILLIS,
  GOOGLE_CLIENT_CONFIG
} from "../_config";

// Constants to identify Redux actions
export const ACTION = {
  INITIALIZED_OK: 'INITIALIZED_OK',
  SIGNED_IN: 'SIGN_IN',
  SIGNED_OUT: 'SIGN_OUT',
  CALENDAR_REFRESH: 'CALENDAR_REFRESH',
  FULLSCREEN_OPENED: 'FULLSCREEN_OPEN',
  FULLSCREEN_CLOSED: 'FULLSCREEN_CLOSE',
  TOGGLE_MENU: 'TOGGLE_MENU',
  EVENT_DISPLAY_REFRESH: 'EVENT_DISPLAY_REFRESH',
  LOADED_CALENDAR_LIST: 'LOAD_CALENDAR_LIST',
  LOADED_EVENTS: 'LOAD_EVENTS',
};

// Setup the initial state
const initialState = {
  isMenuOpen: false,
  isFullscreen: false,
  isSignedIn: false,
  eventDisplayRefreshIntervalId: null,
  calendarRefreshIntervalId: null,
  lastFetchedMillis: null,
  calendarList: [],
  calendarEvents: {},
};

/**
 * The Redux reducer of a game state to an updated game state
 * @param baseState to update
 * @param {{
 *     type:string,
 *     eventDisplayRefreshIntervalId,
 *     calendarRefreshIntervalId,
 *     calendarId:string,
 *     calendarList:[],
 *     events:{},
 * }} action to reduce
 * @return {Reducer} updated state
 */
export const calendarEventReducer = function (baseState, action) {

  // previous state, else (if undefined) new initial state
  const state = !!baseState ? baseState : initialState;

  // use mutate the requested key+value
  switch (action.type) {
    case ACTION.SIGNED_OUT:
      return produce(baseState, nextState => {
        clearInterval(nextState.eventDisplayRefreshIntervalId);
        clearInterval(nextState.calendarRefreshIntervalId);
        nextState.eventDisplayRefreshIntervalId = null;
        nextState.calendarRefreshIntervalId = null;
        nextState.isSignedIn = false;
      });

    case ACTION.TOGGLE_MENU:
      return produce(baseState, nextState => {
        nextState.isMenuOpen = !baseState.isMenuOpen;
      });

    case ACTION.FULLSCREEN_OPENED:
      return produce(baseState, nextState => {
        nextState.isFullscreen = true;
      });

    case ACTION.FULLSCREEN_CLOSED:
      return produce(baseState, nextState => {
        nextState.isFullscreen = false;
      });

    case ACTION.SIGNED_IN:
      return produce(baseState, nextState => {
        // the intervals were created during action construction because we reference that dispatch function
        nextState.eventDisplayRefreshIntervalId = action.eventDisplayRefreshIntervalId;
        nextState.calendarRefreshIntervalId = action.calendarRefreshIntervalId;
        nextState.isSignedIn = true;
      });

    case ACTION.EVENT_DISPLAY_REFRESH:
      return produce(baseState, nextState => {
        // TODO figure out how to make actions refresh
      });

    case ACTION.LOADED_CALENDAR_LIST:
      return produce(baseState, nextState => {
        console.log("Loaded Calendar List", action.calendarList)
        nextState.calendarList = action.calendarList;
      });

    case ACTION.LOADED_EVENTS:
      return produce(baseState, nextState => {
        console.log("Loaded Events", action.events, action.events)
        nextState.events = action.events;
      });

    default:
      return state;
  }
};

/**
 Action to Refresh displayed events
 * @returns {{type: string}}
 */
export const doEventDisplayRefresh = function () {
  return {
    type: ACTION.EVENT_DISPLAY_REFRESH
  }
}

/**
 Action to refresh calendars and events from Google API
 * @returns {Function}
 */
export const doCalendarRefresh = function () {
  return function (dispatch) {
    console.info("Will initialize client for calendar refresh");
    window.gapi.load('client', () => {
      gapi.client.init(GOOGLE_CLIENT_CONFIG).then(() => {
        console.info("Will fetch calendar list");
        gapi.client.load('calendar', 'v3', () => {
          gapi.client.calendar.calendarList.list({
            'maxResults': CALENDAR_FETCH_ROWS_MAX,
            'orderBy': 'startTime'
          }).then((response) => {
            response.result.items.forEach(item => {
              let calendarId = item.id;
              console.info("Will fetch events from calendar ID:", calendarId);
              gapi.client.load('calendar', 'v3', () => {
                gapi.client.calendar.events.list({
                  'calendarId': calendarId,
                  'timeMin': (new Date()).toISOString(),
                  'timeMax': (new Date(Date.now() + CALENDAR_FETCH_TO_FUTURE_MILLIS)).toISOString(),
                  'showDeleted': false,
                  'singleEvents': true,
                  'maxResults': CALENDAR_FETCH_ROWS_MAX,
                  'orderBy': 'startTime'
                }).then((response) => {
                  let calendars = Object.assign({}, this.state.calendars);
                  console.error("BEFORE", this.state.calendars);
                  calendars[calendarId] = response.result.items;
                  console.warn("FUCK", calendars);
                  this.setState({calendars});
                });
              });
            })
          });
        });
      });
    });

    return dispatch({
      type: ACTION.CALENDAR_REFRESH
    });
  }
}

/**
 Action to Toggle Menu
 * @returns {{type: string}}
 */
export const doToggleMenu = function () {
  return {
    type: ACTION.TOGGLE_MENU
  }
}

/**
 Open Fullscreen Action
 * @returns {{type: string}}
 */
export const doFullscreenOpened = function () {
  return {
    type: ACTION.FULLSCREEN_OPENED
  }
}

/**
 Close Fullscreen Action
 * @returns {{type: string}}
 */
export const doFullscreenClosed = function () {
  return {
    type: ACTION.FULLSCREEN_CLOSED
  }
}

/**
 * Sign Out action
 * @returns {{type: string}}
 */
export const doSignOut = function () {
  return {
    type: ACTION.SIGNED_OUT
  }
}

/**
 * Initialized Okay action
 * @returns {{type: string}}
 */
export const doInitializedOk = function () {
  return {
    type: ACTION.INITIALIZED_OK
  }
}

/**
 Sign In Action
 * @returns {Function}
 */
export const doSignIn = function () {
  return function (dispatch) {
    // needs to be done on action construction because we use the dispatch function!
    let eventDisplayRefreshIntervalId = setInterval(() => dispatch(doEventDisplayRefresh()), APP_INTERVAL_MILLIS);
    let calendarRefreshIntervalId = setInterval(() => dispatch(doCalendarRefresh()), CACHE_INVALIDATE_MILLIS);
    dispatch(doEventDisplayRefresh());
    dispatch(doCalendarRefresh());
    return dispatch({
      type: ACTION.SIGNED_IN,
      eventDisplayRefreshIntervalId,
      calendarRefreshIntervalId,
    });
  }
}

/**
 * Initialize the Document's Google API
 */
export const doInitialize = function () {
  return function (dispatch) {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.async = true;
    script.defer = true;
    script.onload = () => dispatch(doInitializedOk());
    document.head.appendChild(script);
  }
}

/**
 Whether the user is signed in
 */
export const selectIsSignedIn = () => {
  return createSelector(
    [(state) => {
      return state.calendar.isSignedIn;
    }],
    (value) => {
      return value;
    });
};

/**
 Whether the menu is open
 */
export const selectIsMenuOpen = () => {
  return createSelector(
    [(state) => {
      return state.calendar.isMenuOpen;
    }],
    (value) => {
      return value;
    });
};

/**
 Whether the app is fullscreen
 */
export const selectIsFullscreen = () => {
  return createSelector(
    [(state) => {
      return state.calendar.isFullscreen;
    }],
    (value) => {
      return value;
    });
};

