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
