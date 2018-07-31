import React, { Component } from 'react';
import {LogItem} from '../utilities/utilities';


class CommsHealthChecker extends Component {
  //takes props.socket
  //throws handle log
  constructor(props){
    super(props);
    this.pingPong = null;
    this.devPingPong = null;
    this.state = { 'ping_pong_times' : [],
    'dev_ping_pong_times' : []};//list of objects {'start' : 0, 'stop' : '0'}
  }

  componentDidMount() {
    this.timerID = setInterval( () => this.ping() , 10000 );
    this.devTimerID = setInterval( () => this.devPing(), 10000);
    this.props.socket.on('pong to client', () => this.pong()); 
    this.props.socket.on('pong from device', (msg) => this.devPong(msg));
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    clearInterval(this.devTimerID);
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

  devPong(msg) {
    if (this.devPingPong) {
     // this.props.handleLog( new LogItem('dev pong received ') );
      this.setState(prevState => ({
        'dev_ping_pong_times' : (prevState.dev_ping_pong_times.length < 30)
        ? prevState.dev_ping_pong_times.concat([{'total' : this.devPingPong.pong(), 'elapsed' : msg.elapsed}])
        : prevState.dev_ping_pong_times.concat([{'total' : this.devPingPong.pong(), 'elapsed' : msg.elapsed}]).slice(30)
      }));
      this.devPingPong = null;
    }

  }

  devPing() {
    if (this.devPingPong == null) {
       //this.props.handleLog( new LogItem('dev ping submitted') );
       this.devPingPong = new pingPong();
       this.props.socket.emit('ping to device');
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

  getDevAverageLatency() {
    if (this.state.dev_ping_pong_times.length > 1) {
      const mapped_array = this.state.dev_ping_pong_times.map(element => element.total);
      return Math.round(mapped_array.reduce((sum,val) => sum + val)/(mapped_array.length));
    } else return 0;
  }

  getAverageDevTimeElapsed() {
    if (this.state.dev_ping_pong_times.length > 1) {
      const mapped_array = this.state.dev_ping_pong_times.map(element => element.elapsed);
      return Math.round(mapped_array.reduce((sum,val) => sum + val)/(mapped_array.length));
    } else return 0;
  }

  render() {
    return (
      <div>
        <div>
        <p> Average Total Latency: {this.getDevAverageLatency()} ms</p>
        </div>
        <div>
        <p> Average Server only latency : {this.getAverageLatency()} ms</p>
        </div>
        <div>
        <p> Average Device only latency (time elapsed): {this.getAverageDevTimeElapsed()} us</p>
        </div>
      </div>
      )
  }
}

export default CommsHealthChecker;

//helpers (private classes)
class pingPong {
  constructor() {
    this.ping = (new Date()).getTime();
  }

  pong() {
    return (new Date()).getTime() - this.ping;
  }
}