import React, { Component } from 'react';
import {LogItem} from '../utilities/utilities';

class CustomCommand extends Component {
  //throws handleLog(log)
  //takes propos.socket
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


export default CustomCommand