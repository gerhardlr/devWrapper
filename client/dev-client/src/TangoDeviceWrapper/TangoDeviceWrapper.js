import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import '../App.css';
import CommsHealthChecker from './CommsHealthChecker/CommsHealthChecker';
import CustomCommand from './CustomCommand/CustomCommand';
import ListItems from './ListItems/ListItems';
import Clock from './Clock/Clock'
//import DeviceDataservice from './DeviceDataservice/DeviceDataservice';// uncomment if wanting to connect to real server
import DeviceDataservice from './DeviceDataServiceMock/DeviceDataServiceMock';// for testing connection to server
import GenericCommands from './GenericCommands/GenericCommands';
import GenericGetAttributes from './GenericGetAttributes/GenericGetAttributes';
import Subscriber from './Subscriber/Subscriber';
import CssModules from 'react-css-modules';
import styles from './style.css'


import {LogItem} from './utilities/utilities';

class TangoDeviceWrapper extends Component {
//connects to name
  constructor(props) {
     super(props);
     this.socket = null;
     this.state = {data: {},
     log: []};
     this.handleLog = this.handleLog.bind(this);
     this.socket = openSocket('http://localhost:5000/test');
     this.handleRestError = this.handleRestError.bind(this);
     this.deviceDataService = new DeviceDataservice('http://localhost:5000/REST/',this.handleRestError);
  }

  handleRestError(error){
    this.handleLog(new LogItem("error generated on REST command:"+JSON.stringify(error))); 
  }

  componentDidMount() {
    //this.handleLog( new LogItem('socket connection initiated') );
    //.next(result => console.log(result));
    this.socket.on( 'socket connected', () => { this.handleLog( new LogItem('socket connected')) } );
    this.socket.on('device event',() => { this.handleLog( new LogItem('device event received')) } );
    this.socket.on('device event error',(data) => { 
      console.log(data);
      return this.handleLog( new LogItem('device event error received'));
    } );

    this.socket.on('connect', () => { this.handleLog( new LogItem('client socket connect on'+this.socket.id))});
    this.socket.on('disconnect', (reason) => { this.handleLog( new LogItem('client disconnecion reason: '+reason))});
    //test
    
  }

  componentWillUnmount() {
    this.socket.emit('disconnect_request');
  }

  handleLog(logItem) {
    this.setState( prevState => ({log : prevState.log.concat([logItem])}));
  }
//
//        <div id ="GenericCommands">Select Command to Execute<GenericCommands handleLog={this.handleLog} deviceDataService={this.deviceDataService} /></div>
//                <CommsHealthChecker handleLog ={this.handleLog} socket = {this.socket}/>
//<tr><td><CustomCommand handleLog={this.handleLog} deviceDataService={this.deviceDataService} /></td></tr>
  render() {
      return (
        <div>
          <div styleName="border_line"></div>
          <table styleName="grid1">
          <tr>
            <td><Clock /></td>
            <td><h1 styleName="main_heading">Tango Device Wrapper for {this.props.name}</h1></td>
            <td><CommsHealthChecker handleLog ={this.handleLog} socket = {this.socket}/></td>
          </tr>
          </table>
          <div styleName = "border_line"></div>
          <table styleName = "grid2">
          <tr>
            <td>
              <table>
              <tr><td><GenericCommands handleLog={this.handleLog} deviceDataService={this.deviceDataService} /></td></tr>
              <tr><td><GenericGetAttributes handleLog={this.handleLog} deviceDataService={this.deviceDataService}/></td></tr>
              </table>
            </td> 
            <td>
              <ListItems list = {this.state.log} /> 
            </td>
            <td>
              Select Attribute to subscribe to
              <Subscriber deviceDataService={this.deviceDataService} socket = {this.socket}/>
            </td>
          </tr>
          </table>
        </div>
      );
  }
 }
 export default CssModules(TangoDeviceWrapper, styles);