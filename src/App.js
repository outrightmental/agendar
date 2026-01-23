// Copyright (C) 2026 Outright Mental

/* global gapi */
import React, {Component} from 'react';
import './App.scss';
import {
  APP_INTERVAL_MILLIS,
  CACHE_INVALIDATE_MILLIS,
  CALENDAR_FETCH_ROWS_MAX,
  EVENT_DESCRIPTION_AUTO_CREATED_GOAL,
  GOOGLE_CLIENT_CONFIG,
  MESSAGE_EMPTY,
  MESSAGE_INITIALIZING,
  MESSAGE_LOADING_CALENDARS,
  MESSAGE_LOADING_EVENTS,
  MESSAGE_STANDBY,
} from "./_config";
import {validateRollingTimeWindow, validateDailyTime} from "./_timeWindowValidation";
import Content from "./Content";
import Event from "./Event";
import Clock from "./Clock";

class App extends Component {

  constructor(props) {
    super(props);
    // Load clock format preference from localStorage, default to 24-hour
    const savedClockFormat = localStorage.getItem('agendar_clock_format');
    const use24Hour = savedClockFormat !== 'false'; // default to true
    
    // Load time window settings from localStorage
    const timeWindowSettings = this.loadTimeWindowSettings();
    
    this.state = {
      statusMessage: MESSAGE_EMPTY,
      alertMessage: MESSAGE_EMPTY,
      isMenuOpen: false,
      isFullscreen: false,
      isSignedIn: false,
      intervalId: null,
      lastFetchedMillis: null,
      calendarList: [],
      calendars: {},
      events: [],
      use24Hour: use24Hour,
      selectedCalendars: this.loadSelectedCalendars(),
      timeWindowMode: timeWindowSettings.mode,
      rollingTimeWindow: timeWindowSettings.rollingTimeWindow,
      dailyBeginsAt: timeWindowSettings.dailyBeginsAt,
      rollingTimeWindowError: null,
      dailyBeginsAtError: null,
    }
  }

  loadSelectedCalendars() {
    try {
      const saved = localStorage.getItem('agendar_selected_calendars');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Failed to load selected calendars from localStorage", e);
      return {};
    }
  }

  saveSelectedCalendars(selectedCalendars) {
    try {
      localStorage.setItem('agendar_selected_calendars', JSON.stringify(selectedCalendars));
    } catch (e) {
      console.error("Failed to save selected calendars to localStorage", e);
    }
  }

  loadTimeWindowSettings() {
    try {
      const saved = localStorage.getItem('agendar_time_window_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load time window settings from localStorage", e);
    }
    // Return defaults
    return {
      mode: 'Daily',
      rollingTimeWindow: '24:00',
      dailyBeginsAt: '4:00 AM',
    };
  }

  saveTimeWindowSettings(mode, rollingTimeWindow, dailyBeginsAt) {
    try {
      const settings = {
        mode,
        rollingTimeWindow,
        dailyBeginsAt,
      };
      localStorage.setItem('agendar_time_window_settings', JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save time window settings to localStorage", e);
    }
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.didLoadGoogleApi();
    };
    document.head.appendChild(script);

    // Begin Interval
    this.setState({
      intervalId: setInterval(() => {
        this.pulse();
      }, APP_INTERVAL_MILLIS)
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  // Pulse happens every N milliseconds
  pulse() {
    if (!this.state.isSignedIn) return;
    let nowMillis = Date.now();
    if (!this.state.lastFetchedMillis || this.state.lastFetchedMillis < nowMillis - CACHE_INVALIDATE_MILLIS) {
      this.fetchCalendars()
      this.setState({lastFetchedMillis: nowMillis});
    } else {
      this.setState({events: this.state.events});
    }
  }

  didLoadGoogleApi() {
    const successCallback = this.onSuccess.bind(this);

    window.gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init(GOOGLE_CLIENT_CONFIG)
      this.auth2.then(() => {
        this.setState({
          isSignedIn: this.auth2.isSignedIn.get(),
        });
        this.pulse();
      });
    });
    window.gapi.load('signin2', function () {
      // Method 3: render a sign in button
      // using this method will show Signed In if the user is already signed in
      const opts = {
        ...GOOGLE_CLIENT_CONFIG,
        width: 200,
        height: 50,
        onsuccess: successCallback
      };
      gapi.signin2.render('login-button', opts)
    })
  }

  onSuccess() {
    this.setState({
      statusMessage: MESSAGE_STANDBY,
      alertMessage: MESSAGE_EMPTY,
    });
    this.setState({
      isSignedIn: true,
    })
  }

  doLogout() {
    this.auth2.signOut().then(
      () => {
        this.setState({
          isSignedIn: false,
          lastFetchedMillis: null,
        })
        window.location.reload(false);
      },
      () => {
        alert("Failed to sign out!");
      }
    );
  }

  doToggleClockFormat() {
    const newFormat = !this.state.use24Hour;
    this.setState({use24Hour: newFormat});
    localStorage.setItem('agendar_clock_format', newFormat.toString());
  }

  // Generate dynamic "no events" message based on time window mode
  getNoEventsMessage() {
    if (this.state.timeWindowMode === 'Rolling') {
      // Parse rolling time window to get hours
      const [hours, minutes] = this.state.rollingTimeWindow.split(':').map(Number);
      const totalHours = hours + (minutes / 60);
      
      // Round to nearest whole number for cleaner display
      const displayHours = Math.round(totalHours);
      
      return `Your calendar is open for the next ${displayHours} hours!`;
    } else {
      // Daily mode
      return "Your calendar is open for the rest of the day!";
    }
  }

  // Calculate the end time for fetching events based on time window settings
  calculateFetchEndTime() {
    const now = new Date();
    
    if (this.state.timeWindowMode === 'Rolling') {
      // Parse rolling time window (hh:mm format)
      if (!validateRollingTimeWindow(this.state.rollingTimeWindow)) {
        console.warn('Invalid rolling time window format, using default 24:00');
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      }
      const [hours, minutes] = this.state.rollingTimeWindow.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      return new Date(now.getTime() + totalMinutes * 60 * 1000);
    } else {
      // Daily mode - calculate until the specified time of day
      if (!validateDailyTime(this.state.dailyBeginsAt)) {
        console.warn('Invalid daily time format, using default 4:00 AM');
        const targetTime = new Date(now);
        targetTime.setHours(4, 0, 0, 0);
        if (targetTime <= now) {
          targetTime.setDate(targetTime.getDate() + 1);
        }
        return targetTime;
      }
      const parts = this.state.dailyBeginsAt.split(' ');
      if (parts.length !== 2) {
        console.warn('Invalid daily time format, using default 4:00 AM');
        const targetTime = new Date(now);
        targetTime.setHours(4, 0, 0, 0);
        if (targetTime <= now) {
          targetTime.setDate(targetTime.getDate() + 1);
        }
        return targetTime;
      }
      const [time, period] = parts;
      const [hours, minutes] = time.split(':').map(Number);
      
      // Convert to 24-hour format
      let hour24 = hours;
      if (period.toUpperCase() === 'PM' && hours !== 12) {
        hour24 += 12;
      } else if (period.toUpperCase() === 'AM' && hours === 12) {
        hour24 = 0;
      }
      
      // Create target time for today
      const targetTime = new Date(now);
      targetTime.setHours(hour24, minutes, 0, 0);
      
      // If target time has passed today, use tomorrow
      if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1);
      }
      
      return targetTime;
    }
  }

  setTimeWindowMode(mode) {
    this.setState({
      timeWindowMode: mode,
      lastFetchedMillis: null,
      rollingTimeWindowError: null,
      dailyBeginsAtError: null
    }, () => {
      this.saveTimeWindowSettings(
        this.state.timeWindowMode,
        this.state.rollingTimeWindow,
        this.state.dailyBeginsAt
      );
    });
  }

  setRollingTimeWindow(value) {
    // Validate the input
    const isValid = validateRollingTimeWindow(value);
    const error = isValid ? null : 'Format: hh:mm (max 168:00, minutes 0-59)';
    
    this.setState({
      rollingTimeWindow: value,
      rollingTimeWindowError: error,
      // Only reset lastFetchedMillis (trigger refetch) if input is valid
      lastFetchedMillis: isValid ? null : this.state.lastFetchedMillis
    }, () => {
      if (isValid) {
        this.saveTimeWindowSettings(
          this.state.timeWindowMode,
          this.state.rollingTimeWindow,
          this.state.dailyBeginsAt
        );
      }
    });
  }

  setDailyBeginsAt(value) {
    // Validate the input
    const isValid = validateDailyTime(value);
    const error = isValid ? null : 'Format: hh:mm AM/PM (e.g., 4:00 AM)';
    
    this.setState({
      dailyBeginsAt: value,
      dailyBeginsAtError: error,
      // Only reset lastFetchedMillis (trigger refetch) if input is valid
      lastFetchedMillis: isValid ? null : this.state.lastFetchedMillis
    }, () => {
      if (isValid) {
        this.saveTimeWindowSettings(
          this.state.timeWindowMode,
          this.state.rollingTimeWindow,
          this.state.dailyBeginsAt
        );
      }
    });
  }
    
  toggleCalendar(calendarId) {
    const selectedCalendars = {
      ...this.state.selectedCalendars,
      [calendarId]: !this.state.selectedCalendars[calendarId]
    };
    this.saveSelectedCalendars(selectedCalendars);
    this.setState({selectedCalendars}, () => {
      // Re-filter events based on new selection
      this.filterEvents();
    });
  }

  filterEvents() {
    const calendars = this.state.calendars;
    let allEvents = [];
    for (let calendarId in calendars) {
      if (calendars.hasOwnProperty(calendarId) && this.state.selectedCalendars[calendarId]) {
        calendars[calendarId]
          .filter(event => !!event.start.dateTime)
          .filter(event => (!event.description || !event.description.includes(EVENT_DESCRIPTION_AUTO_CREATED_GOAL)))
          .forEach(event => allEvents.push(event));
      }
    }

    const events = allEvents.sort(function (e1, e2) {
      const t1 = new Date(e1.start.dateTime);
      const t2 = new Date(e2.start.dateTime);
      if (t1 < t2) {
        return -1;
      }
      if (t1 > t2) {
        return 1;
      }
      return 0;
    });

    this.setState({
      events: events,
      alertMessage: 0 < events.length ? MESSAGE_EMPTY : this.getNoEventsMessage(),
    });
  }

  doMenuButtonClicked() {
    if (this.state.isMenuOpen)
      this.setState({isMenuOpen: false});
    else
      this.setState({isMenuOpen: true});
  }

  doOpenFullscreen() {
    if (document.documentElement.requestFullscreen)
      document.documentElement.requestFullscreen().then(
        () => {
          this.setState({isFullscreen: true})
        },
        () => {
          alert("Failed to open in fullscreen mode!");
        }
      );
    else alert("Fullscreen mode not supported in your browser!");
  }

  doCloseFullscreen() {
    if (document.exitFullscreen)
      document.exitFullscreen().then(
        () => {
          this.setState({isFullscreen: false});
        },
        () => {
          // quietly assume that we have failed to detect somehow that fullscreen was already exited
          this.setState({isFullscreen: false});
        }
      );
    else alert("Fullscreen mode not supported in your browser!");
  }

  fetchCalendars() {
    this.setState({statusMessage: MESSAGE_INITIALIZING});
    window.gapi.load('client', () => {
      gapi.client.init(GOOGLE_CLIENT_CONFIG).then(() => {
        this.setState({statusMessage: MESSAGE_LOADING_CALENDARS});
        gapi.client.load('calendar', 'v3', () => {
          gapi.client.calendar.calendarList.list({
            'maxResults': CALENDAR_FETCH_ROWS_MAX,
            'orderBy': 'startTime'
          }).then((response) => {
            let promises = [];
            this.setState({statusMessage: MESSAGE_LOADING_EVENTS});
            
            // Store calendar list
            const calendarList = response.result.items.map(item => ({
              id: item.id,
              summary: item.summary,
              backgroundColor: item.backgroundColor,
            }));
            
            // Initialize selected calendars if not already set
            const selectedCalendars = {...this.state.selectedCalendars};
            let hasChanges = false;
            calendarList.forEach(cal => {
              if (selectedCalendars[cal.id] === undefined) {
                selectedCalendars[cal.id] = true; // Default to selected
                hasChanges = true;
              }
            });
            
            if (hasChanges) {
              this.saveSelectedCalendars(selectedCalendars);
            }
            
            this.setState({calendarList, selectedCalendars});
            
            response.result.items.forEach(item => {
              let calendarId = item.id;
              promises.push(new Promise((resolve, reject) => {
                console.debug("Will fetch events from calendar ID:", calendarId);
                gapi.client.load('calendar', 'v3', () => {
                  const fetchEndTime = this.calculateFetchEndTime();
                  gapi.client.calendar.events.list({
                    'calendarId': calendarId,
                    'timeMin': (new Date()).toISOString(),
                    'timeMax': fetchEndTime.toISOString(),
                    'showDeleted': false,
                    'singleEvents': true,
                    'maxResults': CALENDAR_FETCH_ROWS_MAX,
                    'orderBy': 'startTime'
                  }).then((response) => {
                    const calendars = {};
                    calendars[calendarId] = response.result.items;
                    resolve(calendars);
                  }, reject);
                });
              }));
            });
            Promise.all(promises).then((allCalendars) => {
              let calendars = {};
              allCalendars.forEach(c => Object.assign(calendars, c));

              let allEvents = [];
              for (let calendarId in calendars)
                if (calendars.hasOwnProperty(calendarId) && this.state.selectedCalendars[calendarId])
                  calendars[calendarId]
                    .filter(event => !!event.start.dateTime)
                    .filter(event => (!event.description || !event.description.includes(EVENT_DESCRIPTION_AUTO_CREATED_GOAL)))
                    .filter(event => event.status !== 'cancelled')
                    .filter(event => {
                      // Filter out events where the current user has declined
                      if (!event.attendees) return true;
                      const selfAttendee = event.attendees.find(attendee => attendee.self);
                      return !selfAttendee || selfAttendee.responseStatus !== 'declined';
                    })
                    .forEach(event => allEvents.push(event));

              const events = allEvents.sort(function (e1, e2) {
                const t1 = new Date(e1.start.dateTime);
                const t2 = new Date(e2.start.dateTime);
                if (t1 < t2) {
                  return -1;
                }
                if (t1 > t2) {
                  return 1;
                }
                return 0;
              });

              this.setState({
                calendars,
                events: events,
                statusMessage: MESSAGE_EMPTY,
                alertMessage: 0 < events.length ? MESSAGE_EMPTY : this.getNoEventsMessage(),
              });
            });
          });
        });
      });
    });
  }

  renderAgendaCalendarEvents() {
    return this.state.events.map(event => <Event key={event.id} event={event} use24Hour={this.state.use24Hour}/>);
  }

  renderAgendaCalendar() {
    if (this.state.isSignedIn) {
      return (
        <div id="agendar-calendar">
          {!!this.state.alertMessage ? <p className="status">{this.state.alertMessage}</p> : ""}
          {this.renderAgendaCalendarEvents()}
        </div>
      )
    } else {
      return (
        <div id="agendar-calendar">
          <div className="hero">
            <Content name="hero"/>
          </div>
          <button className="space-above" id="login-button">Login with Google</button>
          <div className="content space-above">
            <Content name="details"/>
            <Content name="privacy-promise"/>
            <Content name="about"/>
            <Content name="legal"/>
          </div>
        </div>
      )
    }
  }

  renderAgenda() {
    return (
      <div id="agendar">
        <div id="agendar-clock">
          <Clock use24Hour={this.state.use24Hour}/>
          {!!this.state.statusMessage ? <p className="status">{this.state.statusMessage}</p> : ""}
        </div>
        {this.renderAgendaCalendar()}
      </div>
    )
  }

  renderMenuButton() {
    return (
      <div className={`ui-button ${this.state.isMenuOpen ? 'lit' : ''}`}
           id="menu-button" onClick={() => this.doMenuButtonClicked()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
          <title>
            Menu
          </title>
          <path fill="#ffffff"
                d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/>
        </svg>
      </div>
    );
  }

  renderMenuContent() {
    if (this.state.isMenuOpen) return (
      <div id="menu-backdrop" onClick={() => this.doMenuButtonClicked()}>
        <div id="menu-body">
          <div className="menu-item">
            <div className="content">
              <Content name="intro"/>
              <Content name="privacy-promise"/>
              <Content name="about"/>
              <Content name="legal"/>
            </div>
          </div>
          <div className="menu-item menu-selection" onClick={(e) => {
            e.stopPropagation();
            this.doToggleClockFormat();
          }}>
            Clock Format: {this.state.use24Hour ? '24 Hour' : '12 Hour'}
          </div>
          <div className="menu-item" onClick={(e) => e.stopPropagation()}>
            <h3>Time Window</h3>
            <div className="time-window-settings">
              <div className="time-window-mode">
                <label>
                  <input
                    type="radio"
                    name="timeWindowMode"
                    value="Rolling"
                    checked={this.state.timeWindowMode === 'Rolling'}
                    onChange={(e) => {
                      e.stopPropagation();
                      this.setTimeWindowMode('Rolling');
                    }}
                  />
                  <span className="radio-label">Rolling</span>
                  {this.state.timeWindowMode === 'Rolling' && (
                    <div className="time-input-container">
                      <input
                        type="text"
                        className={`time-input ${this.state.rollingTimeWindowError ? 'invalid' : ''}`}
                        value={this.state.rollingTimeWindow}
                        onChange={(e) => {
                          e.stopPropagation();
                          this.setRollingTimeWindow(e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="24:00"
                      />
                      {this.state.rollingTimeWindowError && (
                        <span className="validation-error">{this.state.rollingTimeWindowError}</span>
                      )}
                    </div>
                  )}
                </label>
              </div>
              <div className="time-window-mode">
                <label>
                  <input
                    type="radio"
                    name="timeWindowMode"
                    value="Daily"
                    checked={this.state.timeWindowMode === 'Daily'}
                    onChange={(e) => {
                      e.stopPropagation();
                      this.setTimeWindowMode('Daily');
                    }}
                  />
                  <span className="radio-label">Daily</span>
                  {this.state.timeWindowMode === 'Daily' && (
                    <div className="time-input-container">
                      <input
                        type="text"
                        className={`time-input ${this.state.dailyBeginsAtError ? 'invalid' : ''}`}
                        value={this.state.dailyBeginsAt}
                        onChange={(e) => {
                          e.stopPropagation();
                          this.setDailyBeginsAt(e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="4:00 AM"
                      />
                      {this.state.dailyBeginsAtError && (
                        <span className="validation-error">{this.state.dailyBeginsAtError}</span>
                      )}
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
          {
            this.state.isSignedIn && this.state.calendarList.length > 0 ?
              <div className="menu-item">
                <h3>Select Calendars</h3>
                <div className="calendar-list">
                  {this.state.calendarList.map(calendar => (
                    <div key={calendar.id} className="calendar-item" onClick={(e) => {
                      e.stopPropagation();
                      this.toggleCalendar(calendar.id);
                    }}>
                      <input
                        type="checkbox"
                        checked={!!this.state.selectedCalendars[calendar.id]}
                        onChange={() => this.toggleCalendar(calendar.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="calendar-name">{calendar.summary}</span>
                    </div>
                  ))}
                </div>
              </div> : ''
          }
          {
            this.state.isSignedIn ?
              <div className="menu-item menu-selection" onClick={() => this.doLogout()}>Logout</div> : ''
          }
        </div>
      </div>
    );
    else return "";
  }

  renderFullscreenButton() {
    if (this.state.isFullscreen) return (
      <div className="ui-button" id="fullscreen-button" onClick={() => this.doCloseFullscreen()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
          <title>
            Exit Fullscreen Mode
          </title>
          <path fillRule="evenodd" fill="#ffffff"
                d="M7 7V1H5v4H1v2h6zM5 19h2v-6H1v2h4v4zm10-4h4v-2h-6v6h2v-4zm0-8h4V5h-4V1h-2v6h2z"/>
        </svg>
      </div>
    );
    else return (
      <div className="ui-button" id="fullscreen-button" onClick={() => this.doOpenFullscreen()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
          <title>
            Enter Fullscreen Mode
          </title>
          <path fillRule="evenodd" fill="#ffffff"
                d="M1 1v6h2V3h4V1H1zm2 12H1v6h6v-2H3v-4zm14 4h-4v2h6v-6h-2v4zm0-16h-4v2h4v4h2V1h-2z"/>
        </svg>
      </div>
    );
  }

  render() {
    return (
      <div id="app">
        {this.renderFullscreenButton()}
        {this.renderMenuButton()}
        {this.renderMenuContent()}
        {this.renderAgenda()}
      </div>
    );
  }
}

export default App;
