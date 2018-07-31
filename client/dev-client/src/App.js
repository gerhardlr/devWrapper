import React, { Component } from 'react';
import './App.css';
import TangoDeviceWrapper from './TangoDeviceWrapper/TangoDeviceWrapper';

class App extends Component {
  render() {
    return (
     <TangoDeviceWrapper name = 'sys/tg_test/1'/>    
    );
  }
}

export default App;
