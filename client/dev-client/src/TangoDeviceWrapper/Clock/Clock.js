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
        //<div>
        //<h1>{ this.state.date.toLocaleTimeString() }</h1> {/*styles to be defined int he css file*/}
        //<div class ="border_line"></div> {/* this declaration should not be here*/}
       //</div>
//modified by vale
       <div id='clock_css'>
          { this.state.date.toLocaleTimeString() } 
          <div class ="border_line"></div> {/* this declaration should not be here*/}
       </div>

    );
  }
}

export default CssModules(Clock, styles);
