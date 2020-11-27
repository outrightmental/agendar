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
      isFullscreen: false,
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

  fetchCalendarEvents() {
    // let today = new Date(); //today date
    // let userEmail = "xxx";
    // let userTimeZone = "xxx";

    console.info("Will initialize client");
    window.gapi.load('client', () => {
      gapi.client.init(GOOGLE_CLIENT_CONFIG).then(() => {
        console.info("Will fetch calendar events");
        gapi.client.load('calendar', 'v3', () => {
          gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'timeMax': (new Date(Date.now() + CALENDAR_FETCH_TO_FUTURE_MILLIS)).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': CALENDAR_FETCH_ROWS_MAX,
            'orderBy': 'startTime'
          }).then((response) => {
            let events = response.result.items;
            let i, displayEvents = [];

            if (events.length > 0) {
              for (i = 0; i < events.length; i++) {
                let event = events[i];
                let when = event.start.dateTime;
                if (!when) {
                  when = event.start.date;
                }
                displayEvents.push(<div className="event" key={event.id}>{event.summary} ({when})</div>);
              }
            } else {
              displayEvents = [<div className="event">No upcoming events found.</div>];
            }
            this.setState({calendarEvents: displayEvents});
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
          {this.state.isFullscreen
            ?
            <div id="fullscreenButton" onClick={() => this.doCloseFullscreen()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <title>
                  Exit Fullscreen Mode
                </title>
                <path fillRule="evenodd" fill="#ffffff"
                      d="M7 7V1H5v4H1v2h6zM5 19h2v-6H1v2h4v4zm10-4h4v-2h-6v6h2v-4zm0-8h4V5h-4V1h-2v6h2z"/>
              </svg>
            </div>
            :
            <div id="fullscreenButton" onClick={() => this.doOpenFullscreen()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <title>
                  Enter Fullscreen Mode
                </title>
                <path fillRule="evenodd" fill="#ffffff"
                      d="M1 1v6h2V3h4V1H1zm2 12H1v6h6v-2H3v-4zm14 4h-4v2h6v-6h-2v4zm0-16h-4v2h4v4h2V1h-2z"/>
              </svg>
            </div>
          }
          <div id="logoutButton" onClick={() => this.doLogout()}>Logout</div>
          <header className="App-header">
            <h6>Now</h6>
            {this.renderCalendarEvents()}
          </header>
        </div>
      )
    } else {
      return (
        <div>
          <header className="App-header">
            <h1>Agendar<sup className="tiny">&trade;</sup></h1>
            <h2>Heads-Up Display<br/> for being on time.</h2>
            <button id="loginButton">Login with Google</button>
          </header>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="App">
        {this.renderContent()}
      </div>
    );
  }
}

export default App;
