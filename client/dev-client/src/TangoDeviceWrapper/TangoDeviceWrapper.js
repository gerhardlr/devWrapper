import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import '../App.css';
import CommsHealthChecker from './CommsHealthChecker/CommsHealthChecker';
import CustomCommand from './CustomCommand/CustomCommand';
import ListItems from './ListItems/ListItems';
import Clock from './Clock/Clock'

import {LogItem} from './utilities/utilities';

class TangoDeviceWrapper extends Component {
//connects to name
  constructor(props) {
     super(props);
     this.socket = null;
     this.state = {data: {},
     log: [] };
     this.handleLog = this.handleLog.bind(this);
     this.socket = openSocket('http://localhost:5003/test');
  }

  componentDidMount() {
    //this.handleLog( new LogItem('socket connection initiated') );
    this.socket.on( 'socket connected', () => { this.handleLog( new LogItem('socket connected')) } );
  }

  componentWillUnmount() {
    this.socket.emit('disconnect_request');
  }

  handleLog(logItem) {
    this.setState( prevState => ({log : prevState.log.concat([logItem])}));
  }

  render() {
      return (
        <div>
        <h1>Tango Device Wrapper for {this.props.name}</h1>
        <div id="Clock"><Clock /></div>
        <div id="CommsHealthChecker"><CommsHealthChecker handleLog ={this.handleLog} socket = {this.socket}/></div>
        <div id ="CustomeCommand"><CustomCommand handleLog={this.handleLog} /></div>
        <div id="log"><ListItems list = {this.state.log} /></div>
        </div>
      );
  }
 }
export default TangoDeviceWrapper;