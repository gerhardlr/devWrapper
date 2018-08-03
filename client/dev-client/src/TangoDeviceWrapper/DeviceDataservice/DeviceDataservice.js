
export default class DeviceDataservice {
	constructor(urlbase="'http://localhost:5003/REST/",handleError){
		this.urlbase = urlbase;
		this.mode ='cors';
		this.handleError = handleError;
		this.handleError = this.handleError.bind(this);
		this.putPostPayload = 
		this.getPayload
	}

	encodeParameters(parameters){
		let esc = encodeURIComponent;
		let query = Object.keys(parameters).map(k => esc(k) + '=' + esc(parameters[k])).join('&');
		return query;
	}

	createPostPayload(data){
		return {  
			mode : this.mode,			
			method: 'POST',
  			body: JSON.stringify(data), // data can be `string` or {object}!
  			headers:{
    			'Content-Type': 'application/json'
  			}
  		}
	}

	createPutPayload(data){
		return {  
			mode : this.mode,			
			method: 'PUT',
  			body: JSON.stringify(data), // data can be `string` or {object}!
  			headers:{
    			'Content-Type': 'application/json'
  			}
  		}
	}

	createGetPayload(){
		return {
			mode : this.mode
		}
	}


	Get(endpoint = "test/", parameters = ""){
	//e.g. for read attributes
		let args = (parameters === "") ? "" : this.encodeParameters(parameters);
		const url = this.urlbase+endpoint+args;
		let payload = this.createGetPayload();
		return fetch(url, payload)
		.then(response => response.json())
		.catch(error => this.handleError(error));
	} 

	Post(endpoint = "test/", args){
	//for commands since they change the state
		const url = this.urlbase+endpoint;
		let payload = this.createPostPayload(args);
		return fetch(url,payload)
		.then(response => response.json())
		.catch(error => this.handleError(error));
	}

	Put(endpoint = "test/", parameters){
	//for configuration changes since the dont changes state
		const url = this.urlbase+endpoint;
		let payload = this.createPutPayload(parameters);
		return fetch(url, payload)
		.then(response => response.json())
		.catch(error => this.handleError(error));
	}

	//////////////////////
	//get requests
	command_list_query() {
		return this.Get('command_list_query/');
	}

	get_attribute_list() {
		return this.Get('get_attribute_list/');
	}

	get_property_list() {
		return this.Get('get_property_list/')
	}

	read_attribute(attribute) {
		return this.Get('read_attribute/'+attribute)
	}
	///posts
	command_inout(command,args){
		return this.Post("command_inout/"+command,args)
	}

}