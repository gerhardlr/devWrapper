import React, { Component } from 'react';
import {LogItem} from '../utilities/utilities';

class CustomCommand extends Component {
  //throws handleLog(log)
  //takes props.socket
  //takes props.deviceDataService
  constructor(props) {
    super(props);
    this.state = {command: '', response : ''};

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
    //fetch('http://localhost:5003/REST/test', {mode :'cors'}).then(response => console.log(response.text()));
    this.props.deviceDataService.command_list_query().then(response => console.log(response));
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


export default CustomCommand