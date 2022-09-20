import React, { Component } from "react";

class ShowDateC extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: "",
      hour: "",
    };
  }

  timer = 0;

  //set date on mount
  componentDidMount() {
    this.setState({ date: new Date().toDateString() });
  }
  //set clock, updates on every second
  componentDidUpdate(prevProps, prevState) {
    console.log("date class component prev state", prevState);
    this.timer = setTimeout(() => {
      this.setState({ hour: new Date().toLocaleTimeString() });
    }, 1000);
  }

  //clear clock timer on unmount
  componentWillUnmount() {
    console.log("date class component unmount");
    clearTimeout(this.timer);
  }

  render() {
    return (
      <div>
        <h3>{this.state.date}</h3>
        <h3>{this.state.hour}</h3>
      </div>
    );
  }
}

export default ShowDateC;
