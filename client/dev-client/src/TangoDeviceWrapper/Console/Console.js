import React, { Component } from 'react';
import './Console.css'

//testimg
let test_messages = [
{text : "Hallo world ", time : (new Date()).toLocaleTimeString(), Source : "Device"}, 
{text : "Hallo world2 ", time : (new Date()).toLocaleTimeString(), Source : "Client"},
{text : "Hallo world3 ", time : (new Date()).toLocaleTimeString(), Source : "Device"},
{text : "Hallo world4 ", time : (new Date()).toLocaleTimeString(), Source : "Client"}
];
//


class Console extends Component {

	constructor(props){
		//takes messages
		super(props)
		this.state ={ test_messages : [] };
		//testing this.state.messages = test_messages;
	}

	componentDidMount() {
		//test method
		/*for (var i in test_messages) {
			this.message(test_messages[i]);
		}*/
	}

	test_message(message){
		this.setState(prevState => ({messages : [message].concat(prevState.messages)}) );
	}

	render() {
		//const messages = this.state.test_messages; for testing
		const messages = this.props.messages;
		const message_list = messages.map((message, index) =>
        	<div id ="message" key={index}><div id="message_source"><b>{message.Source}</b></div><div id="message_time"> {message.time}</div>
        	<div id="message_text">{message.text}</div></div>
     	);	

		return (<div id = "console2">
				{message_list}
				</div>);
	}


}

export default Console;