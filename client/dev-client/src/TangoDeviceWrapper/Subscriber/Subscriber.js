import React, { Component } from 'react';



class Subscriber extends Component{

	constructor(props) {
		// tales props.deviceDataService
		super(props)
		this.state = {
    		attributes : [],
    		selected_attributes : []
    	}
    	this.loadAttributes = this.loadAttributes.bind(this);
    	this.handleOnChange = this.handleOnChange.bind(this);
    	this.props.deviceDataService.get_attribute_list().then(response => this.loadAttributes(response));
    	
    }

	loadAttributes(response){
		this.setState({attributes: response});
		return response;
	}

	handleOnChange(event){
		let value = event.target.value;
		this.setState(prevState => {
			let new_selected_attributes = prevState.selected_attributes;
			if (new_selected_attributes.includes(value)) {
				new_selected_attributes.pop(value);
			} else {
				new_selected_attributes.push(value);
			}
			return {selected_attributes : new_selected_attributes }
			});
	}


	render(){

		let attributes = this.state.attributes;
		let selected_attributes  = this.state.selected_attributes;
		let optionItems = attributes.map((attribute,index) =>
                <option key={index}>{attribute}</option>
            );
		let subscribersList =  selected_attributes.map((attribute,index) =>
			<Attribute key = {index} subscriber = {attribute} socket = {this.props.socket} deviceDataService = {this.props.deviceDataService} />
		);

		return (<div id="Subscriber">
			<select multiple = {true} onChange={this.handleOnChange} value={this.state.selected_attributes}>
                {optionItems}
             </select>
             <div>
             {subscribersList}
             </div>

			</div>);

    }
       

}

class Attribute extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			type :"",
			polling: 500,
			eventID: "",
			value: ""
		};
		this.updateAttribute = this.updateAttribute.bind(this)
		let att = this.props.subscriber.toLowerCase( );
		//this.props.deviceDataService.subscribe_to_attibute({attribute:'double_scalar',polling :1000}).then(response=>this.state.eventID = response)
		this.props.deviceDataService.subscribe_to_attibute({ attribute :this.props.subscriber,polling :this.state.polling}).then(response=>this.state.eventID = response)
		this.props.socket.on("__"+att,(data) => this.updateAttribute(data));


	}

	updateAttribute(data){
		console.log(data);
		this.setState({value:data['data']})
	}

	componentWillUnmount() {
    	this.props.deviceDataService.unsubscribe_to_attibute(this.state.eventID)
  	}



	render() {
		return(
			<div>
		<div>name: {this.props.subscriber}</div>
		<div>value: {this.state.value}</div>
		</div>
		);
		

	}
}


export default Subscriber;