/* global gapi */
import React, {Component} from 'react';
import './App.css';
import {
  BEAT_INTERVAL_MILLIS,
  CACHE_INVALIDATE_MILLIS,
  CALENDAR_FETCH_ROWS_MAX,
  CALENDAR_FETCH_TO_FUTURE_MILLIS,
  GOOGLE_CLIENT_CONFIG,
} from "./config";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
      intervalId: null,
      lastFetchedMillis: null,
      calendarEvents: [],
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
    /*
    FUTURE bring back?
        const meta = document.createElement("meta");
        meta.name = "google-signin-client_id";
        meta.content = "%REACT_APP_GOOGLE_ID_OF_WEB_CLIENT%";
        document.head.appendChild(meta);
    */
    document.head.appendChild(script);

    // Begin Interval
    this.setState({
      intervalId: setInterval(() => {
        this.pulse();
      }, BEAT_INTERVAL_MILLIS)
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
      this.fetchCalendarEvents()
      this.setState({lastFetchedMillis: nowMillis});
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
      gapi.signin2.render('loginButton', opts)
    })
  }

  onSuccess() {
    this.setState({
      isSignedIn: true,
    })
  }

  doLogout() {
    let self = this;
    this.auth2.signOut().then(
      () => {
        self.setState({
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

  fetchCalendarEvents() {
    // let today = new Date(); //today date
    // let userEmail = "xxx";
    // let userTimeZone = "xxx";
    let self = this;

    console.info("Will initialize client");
    window.gapi.load('client', () => {
      gapi.client.init(GOOGLE_CLIENT_CONFIG).then(function () {
        console.info("Will fetch calendar events");
        gapi.client.load('calendar', 'v3', function () {
          gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'timeMax': (new Date(Date.now() + CALENDAR_FETCH_TO_FUTURE_MILLIS)).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': CALENDAR_FETCH_ROWS_MAX,
            'orderBy': 'startTime'
          }).then(function (response) {
            let events = response.result.items;
            let i, displayEvents = [];

            if (events.length > 0) {
              for (i = 0; i < events.length; i++) {
                let event = events[i];
                let when = event.start.dateTime;
                if (!when) {
                  when = event.start.date;
                }
                displayEvents.push(<div key={event.id}>{event.summary} ({when})</div>);
              }
            } else {
              displayEvents = [<div>No upcoming events found.</div>];
            }
            self.setState({calendarEvents: displayEvents});
          });
        });
      });
    });
  }

  renderCalendarEvents() {
    return (
      <div>
        {this.state.calendarEvents}
      </div>
    )
  }

  renderContent() {
    if (this.state.isSignedIn) {
      return (
        <div>
          <div id="logoutButton" onClick={() => this.doLogout()}>Logout</div>
          {this.renderCalendarEvents()}
        </div>
      )
    } else {
      return (
        <div>
          <button id="loginButton">Login with Google</button>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Agendar<sup className="tiny">&trade;</sup></h1>
          <h2>Heads-Up Display<br/> for being on time.</h2>
          {this.renderContent()}
        </header>
      </div>
    );
  }
}

export default App;
