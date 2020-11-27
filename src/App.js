/* global gapi */
import React, {Component} from 'react';
import './App.css';
import {BEAT_INTERVAL_MILLIS, CACHE_INVALIDATE_MILLIS, GOOGLE_CLIENT_CONFIG,} from "./config";

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
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
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
              displayEvents.push(<div>{event.summary} ({when})</div>);
            }
          } else {
            displayEvents = [<div>No upcoming events found.</div>];
          }
          self.setState({calendarEvents: displayEvents});
        });
      });
    });
  }

  /*
  TODO use or delete version 2
      console.info("Will load client");
      window.gapi.load('client:calendar', () => {
        console.info("Will fetch calendar events");
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
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
              displayEvents.push(<div>{event.summary} ({when})</div>);
            }
          } else {
            displayEvents = [<div>No upcoming events found.</div>];
          }
          self.setState({calendarEvents: displayEvents});
        });
      });
  */


  /*
  TODO use or delete version 1
      window.gapi.load('calendar', 'v3', function () {
        const request = gapi.client.calendar.events.list({
          'calendarId': userEmail,
          'timeZone': userTimeZone,
          'singleEvents': true,
          'timeMin': today.toISOString(), //gathers only events not happened yet
          'maxResults': CALENDAR_FETCH_ROWS_MAX,
          'orderBy': 'startTime'
        });
        request.execute(function (resp) {
          let events = [];
          for (let i = 0; i < resp.items.length; i++) {
            const item = resp.items[i];
            const allDay = !!item.start.date;
            const startDT = allDay ? item.start.date : item.start.dateTime;
            const dateTime = startDT.split("T"); //split date from time
            const date = dateTime[0].split("-"); //split yyyy mm dd
            const startYear = date[0];
            const startMonth = monthString(date[1]);
            const startDay = date[2];
            const startDateISO = new Date(startMonth + " " + startDay + ", " + startYear + " 00:00:00");
            const startDayWeek = dayString(startDateISO.getDay());
            const time = dateTime[1].split(":"); //split hh ss etc...
            const startHour = pad2Digits(time[0]);
            const startMin = pad2Digits(time[1]);
            events.push(`${startYear} ${startMonth} ${startDay} ${startDayWeek} ${startHour}:${startMin}`);
          }
          self.setState({calendarEvents: events});
        });
  */


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
          <h2>Heads-Up Display for being on time.</h2>
          {this.renderContent()}
        </header>
      </div>
    );
  }
}

function pad2Digits(num) {
  if (num <= 9) {
    return "0" + num;
  }
  return num;
}

function monthString(num) {
  if (num === "01") {
    return "JAN";
  } else if (num === "02") {
    return "FEB";
  } else if (num === "03") {
    return "MAR";
  } else if (num === "04") {
    return "APR";
  } else if (num === "05") {
    return "MAJ";
  } else if (num === "06") {
    return "JUN";
  } else if (num === "07") {
    return "JUL";
  } else if (num === "08") {
    return "AUG";
  } else if (num === "09") {
    return "SEP";
  } else if (num === "10") {
    return "OCT";
  } else if (num === "11") {
    return "NOV";
  } else if (num === "12") {
    return "DEC";
  }
}

function dayString(num) {
  if (num === "1") {
    return "mon"
  } else if (num === "2") {
    return "tue"
  } else if (num === "3") {
    return "wed"
  } else if (num === "4") {
    return "thu"
  } else if (num === "5") {
    return "fri"
  } else if (num === "6") {
    return "sat"
  } else if (num === "0") {
    return "sun"
  }
}

export default App;