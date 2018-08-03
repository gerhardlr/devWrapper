import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import '../App.css';
import CommsHealthChecker from './CommsHealthChecker/CommsHealthChecker';
import CustomCommand from './CustomCommand/CustomCommand';
import ListItems from './ListItems/ListItems';
import Clock from './Clock/Clock'
import DeviceDataservice from './DeviceDataservice/DeviceDataservice';
import GenericCommands from './GenericCommands/GenericCommands';
import GenericGetAttributes from './GenericGetAttributes/GenericGetAttributes';


import {LogItem} from './utilities/utilities';

class TangoDeviceWrapper extends Component {
//connects to name
  constructor(props) {
     super(props);
     this.socket = null;
     this.state = {data: {},
     log: []};
     this.handleLog = this.handleLog.bind(this);
     this.socket = openSocket('http://localhost:5003/test');
     this.handleRestError = this.handleRestError.bind(this);
     this.deviceDataService = new DeviceDataservice('http://localhost:5003/REST/',this.handleRestError);
  }

  handleRestError(error){
    this.handleLog(new LogItem("error generated on REST command:"+JSON.stringify(error))); 
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
//
//        <div id ="GenericCommands">Select Command to Execute<GenericCommands handleLog={this.handleLog} deviceDataService={this.deviceDataService} /></div>
//        <div><CustomCommand handleLog={this.handleLog} deviceDataService={this.deviceDataService} /></div>
  render() {
      return (
        <div>
        <h1>Tango Device Wrapper for {this.props.name}</h1>
        <Clock />
        <CommsHealthChecker handleLog ={this.handleLog} socket = {this.socket}/>
        <GenericCommands handleLog={this.handleLog} deviceDataService={this.deviceDataService} />
        <GenericGetAttributes handleLog={this.handleLog} deviceDataService={this.deviceDataService}/>
        <ListItems list = {this.state.log} />
        </div>
      );
  }
 }
export default TangoDeviceWrapper;