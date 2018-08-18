import React, { Component } from 'react';
import CssModules from 'react-css-modules';
import styles from './style.css'



class Clock extends Component {
  //
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
      this.timerID = setInterval( () => this.tick() , 1000 );
  }

  componentWillUnmount() {
      clearInterval(this.timerID);
  }

  tick() {
      this.setState( { date: new Date() } ) ;
  }

  render() {
      return (
      <div>

        <h3>{ this.state.date.toLocaleTimeString() }</h3>
        <div class ="border_line"></div>
       </div>
    );
  }
}

export default CssModules(Clock, styles);