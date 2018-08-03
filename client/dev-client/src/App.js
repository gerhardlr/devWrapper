import React, { Component } from 'react';
import './App.css';
import TangoDeviceWrapper from './TangoDeviceWrapper/TangoDeviceWrapper';

import Console from './TangoDeviceWrapper/Console/Console';

class App extends Component {
  render() {
  	
    return (
     <TangoDeviceWrapper name = 'sys/tg_test/1'/>    
    );
    
   //for testing
   /*
  return (
     <Console />    
    );
    */
    //testing end
    
  }
}

export default App;
