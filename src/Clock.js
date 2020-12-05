// Copyright (C) 2020 Outright Mental

import React, {Component} from "react";
import './Clock.scss';
import {CLOCK_INTERVAL_MILLIS} from "./_config";
import {fmtDate, fmtTime} from "./_format";

class Clock extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: "",
      time: "",
    }
  }

  componentDidMount() {
    this.setState({
      intervalId: setInterval(() => {
        this.pulse();
      }, CLOCK_INTERVAL_MILLIS)
    });
    this.pulse();
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  pulse() {
    const d = new Date();
    this.setState({
      time: fmtTime(d),
      date: fmtDate(d),
    })
  }

  render() {
    return (
      <div id="clock">
        <p className="date">{this.state.date}</p>
        <p className="time">{this.state.time}</p>
      </div>
    );
  }
}

export default Clock;
