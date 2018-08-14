import React, { Component } from 'react';
import {LogItem} from '../utilities/utilities';
import {makeMessage} from '../utilities/utilities';
import Console from '../Console/Console' ;
import '../Console/Console.css'

class GenericGetAttributes extends Component {

	constructor(props) {
		// tales props.deviceDataService
		super(props)
		this.state = {
    		attributes : new Array(0),
    		messages : []
    	}
    	this.loadAttributes = this.loadAttributes.bind(this);
    	this.logResponse = this.logResponse.bind(this);
    	this.props.deviceDataService.get_attribute_list().then(response => console.log(response));
    	//.then(response => this.loadAttributes(response))
    }

	loadAttributes(response){
		this.setState({attributes: response})
		return response;
	}

	message(message){
		this.setState(prevState => ({messages : prevState.messages.concat([message])}));
	}

	logResponse(message) {
		this.message(message);
	}

	render () {
  		return (
  			<div id = "GenericCommands">
  			<Console messages = {this.state.messages}/>
  			<AttributeSelector attributes = {this.state.attributes} deviceDataService={this.props.deviceDataService}
  			 logResponse={this.logResponse}/>
  			</div>);
	}

}

class AttributeSelector extends Component {

	constructor(props) {
	//takes props.deviceDataService
	//takes props.attributes
	super(props);
	this.state ={selectedAttribute : {},
				inInit : true}
	this.handleOnChange = this.handleOnChange.bind(this);
	}

	handleOnChange(event){
		let selectedAttribute = this.props.attributes.filter((attribute) => attribute == event.target.value)
		if (selectedAttribute.len == 0){
			this.setState({selectedAttribute: {},inInit : true});
		} else {
			this.setState({selectedAttribute: selectedAttribute[0],inInit : false});
			this.submitGetAttribute(selectedAttribute[0]);
		}
	}

	submitGetAttribute(attribute) {
		const message_text = "read " + attribute+" request submitted";
    	const message_source = "Client";
    	this.props.logResponse(makeMessage(message_text,message_source));
    	this.props.deviceDataService.read_attribute(attribute)
		.then(response => this.handleResponse(response,attribute))
	}  
	handleResponse(response,attribute){
		console.log(response);
	  	const response_message = response.value;
	  	const message_text = "read "
	  	+attribute
	  	+" request received, here is my response: "
	  	+response_message;
	  	const message_source ="Server";
	  	this.props.logResponse(makeMessage(message_text,message_source));
	  }

	render(){
		let attributes = this.props.attributes;
		let optionItems = attributes.map((attribute,index) =>
                <option key={index}>{attribute}</option>
            );

		return (<div>
             <select onChange={this.handleOnChange}>
             	<option key="no option">Select Attribute</option>
                {optionItems}
             </select>
             </div>)
    }
       

}

export default GenericGetAttributes