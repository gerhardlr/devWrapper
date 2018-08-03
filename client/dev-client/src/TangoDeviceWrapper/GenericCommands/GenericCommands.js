import React, { Component } from 'react';
import {LogItem} from '../utilities/utilities';
import {makeMessage} from '../utilities/utilities';
import Console from '../Console/Console' ;
import '../Console/Console.css'

class GenericCommands extends Component {

	constructor(props) {
    	super(props);
    	this.state = {
    		commands : new Array(0),
    		messages : []
    	}
    	this.loadCommands = this.loadCommands.bind(this)
    	this.logResponse = this.logResponse.bind(this)
    	this.props.deviceDataService.command_list_query().then(response => this.loadCommands(response)).then(response => console.log(response));
  	}

  	loadCommands(response){
  		this.setState({commands: response})
  		return response;
  	}

  	message(message){
		this.setState(prevState => ({messages : prevState.messages.concat([message])}));
	}

	logResponse(message) {
		this.message(message);
	}

  	render(){
  		return (
  			<div id = "GenericCommands">
  			<Console messages = {this.state.messages}/>
  			<CommandSelector commands = {this.state.commands} deviceDataService={this.props.deviceDataService}
  			 logResponse={this.logResponse}/>
  			</div>)
  	}

}

class CommandSelector extends Component {
	
	constructor(props) {
		//takes props.deviceDataService
		//takes commands
		super(props);
		this.state ={selectedCommand : {},
					inInit : true}
		this.handleOnChange = this.handleOnChange.bind(this);
		this.logResponse = this.logResponse.bind(this);
	}

	handleOnChange(event){
		let selectedCommand = this.props.commands.filter((command) => command.cmd_name == event.target.value)
		if (selectedCommand.len == 0){
			this.setState({selectedCommand: {},inInit : true});
		} else {
			this.setState({selectedCommand: selectedCommand[0],inInit : false});
		}
	}

	logResponse(message){
		this.props.logResponse(message);
	}

	render(){
		let commands = this.props.commands;
		let inputControl = "";
		let optionItems = commands.map((command) =>
                <option key={command.cmd_name}>{command.cmd_name}</option>
            );

		if (!this.state.inInit) {
			inputControl = (<div id="CommandInput"><p></p><CommandInput command={this.state.selectedCommand}
			deviceDataService = {this.props.deviceDataService} logResponse = {this.logResponse}/></div>);
		} 
		return (<div>
             <select onChange={this.handleOnChange}>
             	<option key="no option">Select Command</option>
                {optionItems}
             </select>
             {inputControl}
         	</div>)
	}
}

class CommandInput extends Component {
	//trows logresponse
  constructor(props) {
    super(props);
    this.state = {input: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({input: event.target.value});
  }
 
  handleSubmit(event) {
    event.preventDefault();
    const message_text = "Command, "+this.props.command.cmd_name+" submitted";
    const message_source = "Client";
    this.props.logResponse(makeMessage(message_text,message_source));
    let input = (this.state.input == '') ? 'null' : this.state.input;
	this.props.deviceDataService.command_inout(this.props.command.cmd_name,input)
		.then(response => this.handleResponse(response))
	this.setState({input: ''});
  }

  handleResponse(response){
  	const response_message = response;
  	const message_text = "Command, "
  	+this.props.command.cmd_name
  	+" received, here is my response: "
  	+response_message;
  	const message_source ="Server";
  	this.props.logResponse(makeMessage(message_text,message_source));
  }

  	render() {
  		let to_render ="";
  		let input = "";
  		if (this.props.command != null) {
	  		if (this.props.command.in_type != "tango._tango.CmdArgType.DevVoid"){
	  			input = (
	  				<label>
	          		Input Argument 
	          		<input type="text" value={this.state.input} onChange={this.handleChange} />
	          		</label>);
	        }
	    	to_render = (
	      	<form onSubmit={this.handleSubmit}>
	      		{input}
	        	<input type="submit" value={"submit: "+this.props.command.cmd_name} />
	     	 </form>);
    	}
    	return (<div> {to_render} </div>);
  }
}





export default GenericCommands





