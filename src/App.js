// Copyright (C) 2020 Outright Mental

import React from 'react';
import './App.scss';
import Content from "./Content";
import Event from "./Event";
import Clock from "./Clock";

// vendor
import {Provider, useDispatch, useSelector} from "react-redux";
// app
import store from "./engine";
import {
  doFullscreenClosed,
  doFullscreenOpened,
  doSignIn,
  doSignOut,
  doToggleMenu,
  selectIsFullscreen,
  selectIsSignedIn
} from "./engine/CalendarEventEngine";


function App(/*props*/) {

  const
    dispatch = useDispatch();

  const
    isFullscreenSelector = selectIsFullscreen(),
    isFullscreen = useSelector(state => isFullscreenSelector(state));

  const
    isSignedInSelector = selectIsSignedIn(),
    isSignedIn = useSelector(state => isSignedInSelector(state));

  const
    calendarEventsSelector = selectCalendarEvents(),
    calendarEvents = useSelector(state => calendarEventsSelector(state));

  const
    signIn = () => dispatch(doSignIn()),
    signOut = () => dispatch(doSignOut()),
    fullscreenOpened = () => dispatch(doFullscreenOpened()),
    fullscreenClosed = () => dispatch(doFullscreenClosed()),
    toggleMenu = () => dispatch(doToggleMenu());

  const fullscreenOpen = function () {
    if (document.documentElement.requestFullscreen)
      document.documentElement.requestFullscreen().then(
        () => {
          fullscreenOpened();
        },
        () => {
          alert("Failed to open in fullscreen mode!");
        }
      );
    else alert("Fullscreen mode not supported in your browser!");
  }

  const fullscreenClose = function () {
    if (document.exitFullscreen)
      document.exitFullscreen().then(
        () => {
          fullscreenClosed();
        },
        () => {
          // quietly assume that we have failed to detect somehow that fullscreen was already exited
          fullscreenClosed();
        }
      );
    else alert("Fullscreen mode not supported in your browser!");
  }

  /*

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


    getAllEvents() {
      let events = [];
      console.log("this.state.calendars", events);
      for (let calendarId in this.state.calendars)
        if (this.state.calendars.hasOwnProperty(calendarId)) {
          console.log("PRE-SET", events);
          events.push(this.state.calendars[calendarId]);
        }
      console.log("PRE-SET", events);
      return events.sort(function (e1, e2) {
        const t1 = e1.start.dateTime ?
          new Date(e1.start.dateTime) :
          new Date(e1.start.date);
        const t2 = e2.start.dateTime ?
          new Date(e2.start.dateTime) :
          new Date(e2.start.date);
        if (t1 < t2) {
          return -1;
        }
        if (t1 > t2) {
          return 1;
        }
        return 0;
      });
    }
  */

  const renderAgendaCalendar = isSignedIn ?
    (
      <div id="agendar-calendar">
        {calendarEvents.map(event => <Event key={event.id} event={event}/>)}
      </div>
    )
    :
    (
      <div id="agendar-calendar">
        <div className="hero">
          <Content name="hero"/>
        </div>
        <button className="space-above" id="login-button">Login with Google</button>
        <div className="content space-above">
          <Content name="privacy-promise"/>
        </div>
      </div>
    );

  const renderAgenda =
    (
      <div id="agendar">
        <div id="agendar-clock">
          <Clock/>
        </div>
        {renderAgendaCalendar}
      </div>
    );

  function renderMenuButton() {
    return (
      <div className={`ui-button ${this.state.isMenuOpen ? 'lit' : ''}`}
           id="menu-button" onClick={toggleMenu}>
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

  function renderMenuContent() {
    if (this.state.isMenuOpen) return (
      <div id="menu-backdrop" onClick={toggleMenu}>
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
              <div className="menu-item menu-selection" onClick={signOut}>Logout</div> : ''
          }
        </div>
      </div>
    );
    else return "";
  }

  const renderFullscreenButton = isFullscreen ?
    (
      <div className="ui-button" id="fullscreen-button" onClick={fullscreenClose}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
          <title>
            Exit Fullscreen Mode
          </title>
          <path fillRule="evenodd" fill="#ffffff"
                d="M7 7V1H5v4H1v2h6zM5 19h2v-6H1v2h4v4zm10-4h4v-2h-6v6h2v-4zm0-8h4V5h-4V1h-2v6h2z"/>
        </svg>
      </div>
    )
    :
    (
      <div className="ui-button" id="fullscreen-button" onClick={fullscreenOpen}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
          <title>
            Enter Fullscreen Mode
          </title>
          <path fillRule="evenodd" fill="#ffffff"
                d="M1 1v6h2V3h4V1H1zm2 12H1v6h6v-2H3v-4zm14 4h-4v2h6v-6h-2v4zm0-16h-4v2h4v4h2V1h-2z"/>
        </svg>
      </div>
    );

  return (
    <Provider store={store}>
      <div id="app">
        {renderFullscreenButton}
        {renderMenuButton}
        {renderMenuContent}
        {renderAgenda}
      </div>
    </Provider>
  );
}

export default App;
