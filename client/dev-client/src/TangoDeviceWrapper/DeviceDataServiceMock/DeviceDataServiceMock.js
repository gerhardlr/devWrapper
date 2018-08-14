


const property_list = ["ampli", "boolean_scalar", "double_scalar",
 "double_scalar_rww", "double_scalar_w", "float_scalar", "long64_scalar",
  "long_scalar", "long_scalar_rww", "long_scalar_w", "no_value", "short_scalar",
   "short_scalar_ro", "short_scalar_rww", "short_scalar_w", "string_scalar",
    "throw_exception", "uchar_scalar", "ulong64_scalar", "ushort_scalar", "ulong_scalar",
     "boolean_spectrum", "boolean_spectrum_ro", "double_spectrum", "double_spectrum_ro",
      "float_spectrum", "float_spectrum_ro", "long64_spectrum_ro", "long_spectrum",
       "long_spectrum_ro", "short_spectrum", "short_spectrum_ro", "string_spectrum",
        "string_spectrum_ro", "uchar_spectrum", "uchar_spectrum_ro", "ulong64_spectrum_ro",
         "ulong_spectrum_ro", "ushort_spectrum", "ushort_spectrum_ro", "wave", "boolean_image",
          "boolean_image_ro", "double_image", "double_image_ro", "float_image", "float_image_ro",
           "long64_image_ro", "long_image", "long_image_ro", "short_image", "short_image_ro", "string_image",
            "string_image_ro", "uchar_image", "uchar_image_ro", "ulong64_image_ro", "ulong_image_ro",
             "ushort_image", "ushort_image_ro", "State", "Status"];
var $property_list = new Promise(
    function (resolve, reject) {
    	resolve(property_list);
    });

const commands_list = 
[
    {
        "cmd_name": "CrashFromDevelopperThread",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.EXPERT",
        "in_type": "tango._tango.CmdArgType.DevVoid",
        "in_type_desc": "Uninitialised",
        "out_type": "tango._tango.CmdArgType.DevVoid",
        "out_type_desc": "Uninitialised"
    },
    {
        "cmd_name": "CrashFromOmniThread",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.EXPERT",
        "in_type": "tango._tango.CmdArgType.DevVoid",
        "in_type_desc": "Uninitialised",
        "out_type": "tango._tango.CmdArgType.DevVoid",
        "out_type_desc": "Uninitialised"
    },
    {
        "cmd_name": "DevBoolean",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevBoolean",
        "in_type_desc": "Anybooleanvalue",
        "out_type": "tango._tango.CmdArgType.DevBoolean",
        "out_type_desc": "Echoofthearginvalue"
    },
    {
        "cmd_name": "DevDouble",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevDouble",
        "in_type_desc": "AnyDevDoublevalue",
        "out_type": "tango._tango.CmdArgType.DevDouble",
        "out_type_desc": "Echoofthearginvalue"
    },
    {
        "cmd_name": "DevFloat",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevFloat",
        "in_type_desc": "AnyDevFloatvalue",
        "out_type": "tango._tango.CmdArgType.DevFloat",
        "out_type_desc": "Echoofthearginvalue"
    },
    {
        "cmd_name": "DevLong",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevLong",
        "in_type_desc": "AnyDevLongvalue",
        "out_type": "tango._tango.CmdArgType.DevLong",
        "out_type_desc": "Echoofthearginvalue"
    },
    {
        "cmd_name": "DevLong64",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevLong64",
        "in_type_desc": "AnyDevLong64value",
        "out_type": "tango._tango.CmdArgType.DevLong64",
        "out_type_desc": "Echoofthearginvalue"
    },
    {
        "cmd_name": "DevShort",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevShort",
        "in_type_desc": "AnyDevShortvalue",
        "out_type": "tango._tango.CmdArgType.DevShort",
        "out_type_desc": "Echoofthearginvalue"
    },
    {
        "cmd_name": "DevString",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevString",
        "in_type_desc": "-",
        "out_type": "tango._tango.CmdArgType.DevString",
        "out_type_desc": "-"
    },
    {
        "cmd_name": "DevULong",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevULong",
        "in_type_desc": "AnyDevULong",
        "out_type": "tango._tango.CmdArgType.DevULong",
        "out_type_desc": "Echoofthearginvalue"
    },
    {
        "cmd_name": "DevULong64",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevULong64",
        "in_type_desc": "AnyDevULong64value",
        "out_type": "tango._tango.CmdArgType.DevULong64",
        "out_type_desc": "Echoofthearginvalue"
    },
    {
        "cmd_name": "DevUShort",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevUShort",
        "in_type_desc": "AnyDevUShortvalue",
        "out_type": "tango._tango.CmdArgType.DevUShort",
        "out_type_desc": "Echoofthearginvalue"
    },
    {
        "cmd_name": "DevVarCharArray",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVarCharArray",
        "in_type_desc": "-",
        "out_type": "tango._tango.CmdArgType.DevVarCharArray",
        "out_type_desc": "-"
    },
    {
        "cmd_name": "DevVarDoubleArray",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVarDoubleArray",
        "in_type_desc": "-",
        "out_type": "tango._tango.CmdArgType.DevVarDoubleArray",
        "out_type_desc": "-"
    },
    {
        "cmd_name": "DevVarDoubleStringArray",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVarDoubleStringArray",
        "in_type_desc": "-",
        "out_type": "tango._tango.CmdArgType.DevVarDoubleStringArray",
        "out_type_desc": "-"
    },
    {
        "cmd_name": "DevVarFloatArray",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVarFloatArray",
        "in_type_desc": "-",
        "out_type": "tango._tango.CmdArgType.DevVarFloatArray",
        "out_type_desc": "-"
    },
    {
        "cmd_name": "DevVarLong64Array",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVarLong64Array",
        "in_type_desc": "Uninitialised",
        "out_type": "tango._tango.CmdArgType.DevVarLong64Array",
        "out_type_desc": "Uninitialised"
    },
    {
        "cmd_name": "DevVarLongArray",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVarLongArray",
        "in_type_desc": "-",
        "out_type": "tango._tango.CmdArgType.DevVarLongArray",
        "out_type_desc": "-"
    },
    {
        "cmd_name": "DevVarLongStringArray",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVarLongStringArray",
        "in_type_desc": "-",
        "out_type": "tango._tango.CmdArgType.DevVarLongStringArray",
        "out_type_desc": "-"
    },
    {
        "cmd_name": "DevVarShortArray",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVarShortArray",
        "in_type_desc": "-",
        "out_type": "tango._tango.CmdArgType.DevVarShortArray",
        "out_type_desc": "-"
    },
    {
        "cmd_name": "DevVarStringArray",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVarStringArray",
        "in_type_desc": "-",
        "out_type": "tango._tango.CmdArgType.DevVarStringArray",
        "out_type_desc": "-"
    },
    {
        "cmd_name": "DevVarULong64Array",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVarULong64Array",
        "in_type_desc": "Uninitialised",
        "out_type": "tango._tango.CmdArgType.DevVarULong64Array",
        "out_type_desc": "Uninitialised"
    },
    {
        "cmd_name": "DevVarULongArray",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVarULongArray",
        "in_type_desc": "-",
        "out_type": "tango._tango.CmdArgType.DevVarULongArray",
        "out_type_desc": "-"
    },
    {
        "cmd_name": "DevVarUShortArray",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVarUShortArray",
        "in_type_desc": "-",
        "out_type": "tango._tango.CmdArgType.DevVarUShortArray",
        "out_type_desc": "-"
    },
    {
        "cmd_name": "DevVoid",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVoid",
        "in_type_desc": "N/A",
        "out_type": "tango._tango.CmdArgType.DevVoid",
        "out_type_desc": "N/A"
    },
    {
        "cmd_name": "DumpExecutionState",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.EXPERT",
        "in_type": "tango._tango.CmdArgType.DevVoid",
        "in_type_desc": "Uninitialised",
        "out_type": "tango._tango.CmdArgType.DevVoid",
        "out_type_desc": "Uninitialised"
    },
    {
        "cmd_name": "Init",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVoid",
        "in_type_desc": "Uninitialised",
        "out_type": "tango._tango.CmdArgType.DevVoid",
        "out_type_desc": "Uninitialised"
    },
    {
        "cmd_name": "State",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVoid",
        "in_type_desc": "Uninitialised",
        "out_type": "tango._tango.CmdArgType.DevState",
        "out_type_desc": "Devicestate"
    },
    {
        "cmd_name": "Status",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVoid",
        "in_type_desc": "Uninitialised",
        "out_type": "tango._tango.CmdArgType.DevString",
        "out_type_desc": "Devicestatus"
    },
    {
        "cmd_name": "SwitchStates",
        "cmd_tag": "0",
        "disp_level": "tango._tango.DispLevel.OPERATOR",
        "in_type": "tango._tango.CmdArgType.DevVoid",
        "in_type_desc": "Uninitialised",
        "out_type": "tango._tango.CmdArgType.DevVoid",
        "out_type_desc": "Uninitialised"
    }
]

var $commands_list = new Promise(
    function (resolve, reject) {
    	resolve(commands_list);
    });

var $attribute = new Promise(
    function (resolve, reject) {
    	resolve("");
    });

var $command = new Promise(
    function (resolve, reject) {
    	resolve("");
    });

var $eventID = new Promise(
    function (resolve, reject) {
    	resolve("");
    });

export default class DeviceDataservice {
	constructor(urlbase="'http://localhost:5003/REST/",handleError){
		this.urlbase = urlbase;
		this.mode ='cors';
		this.handleError = handleError;
		this.handleError = this.handleError.bind(this);
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

		return $commands_list;
		//return this.Get('command_list_query/');
	}

	get_attribute_list() {
		return $property_list;
		//return this.Get('get_attribute_list/');
	}

	get_property_list() {
		return $property_list;
		//return this.Get('get_property_list/')
	}

	read_attribute(attribute) {
		return $attribute;
		//return this.Get('read_attribute/'+attribute);
	}
	///posts
	command_inout(command,args){
		return $command;
		//return this.Post("command_inout/"+command,args);
	}

	//puts
	subscribe_to_attibute(attribute){
		return $attribute
		//return this.Put("subscribe_to_attribute", attribute);
	}

	unsubscribe_to_attibute(eventID){
		return $eventID
		//return this.Put("unsubscribe_to_attribute", eventID);
	}

}