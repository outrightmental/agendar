/* global gapi */
import React, {Component} from 'react';
import './App.css';
import {GOOGLE_CLIENT_ID} from "./config";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
    }
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initAuth();
    };
    const meta = document.createElement("meta");
    meta.name = "google-signin-client_id";
    meta.content = "%REACT_APP_GOOGLE_ID_OF_WEB_CLIENT%";
    document.head.appendChild(meta);
    document.head.appendChild(script);
  }

  initAuth() {
    const successCallback = this.onSuccess.bind(this);

    window.gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: GOOGLE_CLIENT_ID,
      })

      this.auth2.then(() => {
        console.log('on init');
        this.setState({
          isSignedIn: this.auth2.isSignedIn.get(),
        });
      });
    });

    window.gapi.load('signin2', function () {
      // Method 3: render a sign in button
      // using this method will show Signed In if the user is already signed in
      var opts = {
        width: 200,
        height: 50,
        client_id: GOOGLE_CLIENT_ID,
        onsuccess: successCallback
      }
      gapi.signin2.render('loginButton', opts)
    })
  }

  onSuccess() {
    console.log('on success')
    this.setState({
      isSignedIn: true,
      err: null
    })
  }

  doLogout() {
    let self = this;
    this.auth2.signOut().then(
      () => {
        self.setState({
          isSignedIn: false,
          err: null
        })
        window.location.reload(false);
      },
      () => {
        this.setState({
          isSignedIn: true,
          err: "Failed to logout!"
        });
      }
    );
  }

  getContent() {
    if (this.state.isSignedIn) {
      return (
        <div>
          <p>hello user, you're signed in </p>
          <button onClick={() => this.doLogout()}>Logout</button>
        </div>
      )
    } else {
      return (
        <div>
          <p>You are not signed in. Click here to sign in.</p>
          <button id="loginButton">Login with Google</button>
        </div>
      )
    }
  }

  getError() {
    if (this.state.err) {
      return (
        <div>
          <p className="error">{this.state.err}</p>
        </div>
      )
    } else return "";
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Agendar<sup>&trade;</sup></h1>
          <h2>Heads-Up Display for being on time.</h2>
          {this.getContent()}
          {this.getError()}
        </header>
      </div>
    );
  }
}

export default App;