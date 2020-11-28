// Copyleft 2020 Outright Mental

import {
  APP_INTERVAL_MILLIS,
  CACHE_INVALIDATE_MILLIS
} from "./config";
import {Component} from "react";

class Clock extends Component {

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
    }
  }

  render() {
    return (
      <div id="clock">
        <p className="date">{date}</p>
        <p className="time">{time}</p>
      </div>
    );
  }
}

export default Clock;
