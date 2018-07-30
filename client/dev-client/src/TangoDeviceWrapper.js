import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import './App.css';


class LogItem {
  constructor(text){
    this.text = text;
    this.time = new Date();
  }
}


class TangoDeviceWrapper extends Component {
//
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
        <Clock />
        <CommsHealthChecker handleLog ={this.handleLog} socket = {this.socket}/>
        <CustomCommand handleLog={this.handleLog} />
        <div id="log"><ListItems list = {this.state.log} /></div>
        </div>
      );
  }
  }


class CustomCommand extends Component {
  //throws handleLog(log)
  constructor(props) {
    super(props);
    this.state = {command: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({command: event.target.value});
  }
 
  handleSubmit(event) {
    event.preventDefault();
    this.props.handleLog(new LogItem('custom command send '+this.state.command) );
    this.setState({command: ''});

  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Enter Custom Command:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}


function ListItems(props){
    const list = props.list;
    const listItems = list.map((item, index) =>
        <li key ={index}>{item.text+" "+item.time.toLocaleTimeString()}</li>
     );
    return (<ol>{listItems}</ol>);
}

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
      </div>
    );
  }
}


class pingPong {
  constructor() {
    this.ping = (new Date()).getTime();
  }

  pong() {
    return (new Date()).getTime() - this.ping;
  }
}


class CommsHealthChecker extends Component {
  //takes props.socket
  //throws handle log
  constructor(props){
    super(props);
    this.pingPong = null;
    this.state = { 'ping_pong_times' : []};//list of objects {'start' : 0, 'stop' : '0'}
  }

  componentDidMount() {
    this.timerID = setInterval( () => this.ping() , 10000 );
    this.props.socket.on('pong to client', () => this.pong()); 
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  pong(){
    if (this.pingPong) {
      //this.props.handleLog( new LogItem('pong received ') );
      this.setState(prevState => ({
        'ping_pong_times' : (prevState.ping_pong_times.length < 30) 
        ? prevState.ping_pong_times.concat([this.pingPong.pong()])
        : prevState.ping_pong_times.concat([this.pingPong.pong()]).slice(30)
        }) );
      this.pingPong = null;
    }
  }

  ping() {
    if (this.pingPong == null) {
     // this.props.handleLog( new LogItem('ping submitted') );
      this.pingPong = new pingPong();
      this.props.socket.emit('ping to server');
    }
  }

  getAverageLatency(){
    if (this.state.ping_pong_times.length > 1) {
      return Math.round(this.state.ping_pong_times.reduce((sum, val) => sum + val)/(this.state.ping_pong_times.length));
    } else return 0;

  }

  render() {
    return (
      <div>
       Average latency : {this.getAverageLatency()} 
      </div>
      )
  }

}




export default TangoDeviceWrapper;