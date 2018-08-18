import React, { Component } from 'react';
import {LogItem} from '../utilities/utilities';
import CssModules from 'react-css-modules';
import styles from './style.css'


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
    this.timerID = setInterval( () => this.ping() , 1000 );
    this.devTimerID = setInterval( () => this.devPing(), 1000);
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
    let DevAverageLatency = this.getDevAverageLatency();
    let AverageLatency = this.getAverageLatency();
    let AverageDevTimeElapsed = this.getAverageDevTimeElapsed ();
    let DevAverageLatencyInPercentage = Math.round((DevAverageLatency/100)*100)+"%";
    let AverageLatencyInPercentage = Math.round((AverageLatency/100)*100)+"%";
    let AverageDevTimeElapsedInPercentage = Math.round((AverageDevTimeElapsed/1000)*100)+"%";
    let barwidth = ("barwidth" in this.props) ? this.prop.barwidth : "100px";
    return (
      <div>
        <table>
          <tr>
          <td>Lat Tot ({DevAverageLatency} ms)</td>
          <td style={{width:barwidth}}><div styleName = "top_speed_bar" style = {{width: DevAverageLatencyInPercentage}}></div></td>  
          </tr>
          <tr>
          <td>Lat Ser ({AverageLatency} ms)</td>
          <td style={{width:barwidth}}><div styleName = "middle_speed_bar"  style = {{width: AverageLatencyInPercentage}}></div></td> 
          </tr>
          <tr>
          <td>Dev Lat ({AverageDevTimeElapsed} us)</td>
          <td style={{width:barwidth}}><div styleName = "bottom_speed_bar" style = {{width: AverageDevTimeElapsedInPercentage}}></div></td> 
          </tr>   
        </table>
      </div>
      )
  }
}
export default CssModules(CommsHealthChecker, styles);

//helpers (private classes)
class pingPong {
  constructor() {
    this.ping = (new Date()).getTime();
  }

  pong() {
    return (new Date()).getTime() - this.ping;
  }
}