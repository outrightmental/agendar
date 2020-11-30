// Copyleft 2020 Outright Mental

/* global gapi */
import React, {Component} from 'react';
import './App.scss';
import {
  APP_INTERVAL_MILLIS,
  CACHE_INVALIDATE_MILLIS,
  CALENDAR_FETCH_ROWS_MAX,
  CALENDAR_FETCH_TO_FUTURE_MILLIS,
  GOOGLE_CLIENT_CONFIG,
} from "./_config";
import Content from "./Content";
import Event from "./Event";
import Clock from "./Clock";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
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
      this.fetchCalendarEvents()
      this.setState({lastFetchedMillis: nowMillis});
    } else {
      this.setState({calendarEvents: this.state.calendarEvents});
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
            this.setState({calendarEvents: response.result.items});
          });
        });
      });
    });
  }

  renderAgendaCalendar() {
    if (this.state.isSignedIn) {
      return (
        <div id="agendar-calendar">
          {this.state.calendarEvents.map(event => <Event key={event.id} event={event}/>)}
        </div>
      )
    } else {
      return (
        <div id="agendar-calendar">
          <Content name="hero"/>
          <button className="space-above" id="login-button">Login with Google</button>
          <div className="content space-above">
            <Content name="privacy-promise"/>
          </div>
        </div>
      )
    }
  }

  renderAgenda() {
    return (
      <div id="agendar">
        <div id="agendar-clock">
          <Clock/>
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
