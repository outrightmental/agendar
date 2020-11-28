// Copyleft 2020 Outright Mental

import {Component} from "react";
import './Clock.scss';
import {
  CLOCK_INTERVAL_MILLIS,
  WEEK_DAYS
} from "./_config";

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
      time: `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`,
      date: `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${WEEK_DAYS[d.getDay()]}`,
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

function pad2(num) {
  return num < 10 ? `0${num}` : `${num}`;
}

export default Clock;
