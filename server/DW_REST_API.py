
####REST API section
def handleException(e):
    response = {}
    if isinstance(e,DevFailed):
        response['exception'] = 'DevFailed'
    elif isinstance(e,CommunicationFailed):
        response['exception'] = 'CommunicationFailed'
    elif isinstance(e,ConnectionFailed):
        response['exception'] = 'ConnectionFailed'
    errors = [];
    for error in e:
        errors.append({'reason':error.reason,'severity':error.severity.name,'desc':error.desc,'origin':error.origin})
    response['errors'] = errors
    if app.testing:
        Log("exception caught",'d')
        Log(response,'d')
    return response

def encodeArg(command,arg,p):
    #TODO

    commandInfo ="" ###_#( p.command_query(command))
    inputType = commandInfo.in_type
    Mapp = {
        CmdArgType.DevBoolean : 'bool',
        CmdArgType.DEV_SHORT: 'int',
        CmdArgType.DEV_LONG: 'int',
        CmdArgType.DEV_LONG64: 'int',
        CmdArgType.DEV_FLOAT: 'float',
        CmdArgType.DEV_DOUBLE: 'float',
        CmdArgType.DEV_USHORT: 'int',
        CmdArgType.DEV_ULONG: 'int',
        CmdArgType.DEV_ULONG64: 'int',
        CmdArgType.DEV_STRING: 'float',
        CmdArgType.DevVarCharArray: 'intArray',
        CmdArgType.DevVarDoubleArray: 'floatArray',
        CmdArgType.DevVarDoubleStringArray: 'float_StringArray',
        CmdArgType.DevVarLongStringArray: 'int_StringArray',
        CmdArgType.DevVarShortArray: 'intArray',
        CmdArgType.DevVarStringArray: 'StringArray',
        CmdArgType.DevVarULong64Array: 'intArray',
        CmdArgType.DevVarULongArray: 'intArray',
        CmdArgType.DevVarFloatArray: 'intArray',
        CmdArgType.DevVarUShortArray: 'intArray',
    }

@app.route('/REST/subscribe_to_attribute',methods =['PUT'])
def subscribe_to_attribute():
    Log("in subscribe_to_attribute",'d')
    global events
    session_proxy
    callback = lambda event: events.put(event)
    data = request.get_json()
    attribute = data['attribute'].encode("utf-8")
    polling = int(data['polling'])
    Log("setting subscription for "+attribute+" to polling period of "+str(polling),'d')
    try:
        with thread_lock:
            global disable_Pytango
            if disable_Pytango:
                session_proxy.poll_attribute(attribute,polling)
                event_id = session_proxy.subscribe_event(attribute, EventType.PERIODIC_EVENT, callback, [], True)
        #3 session_proxy.unsubscribe_event(event_id)

    except (CommunicationFailed,ConnectionFailed,DevFailed) as e:
        return jsonify(handleException(e))
    return jsonify(event_id)

@app.route('/REST/unsubscribe_to_attribute',methods =['PUT'])
def unsubscribe_to_attribute():
    Log("in unsubscribe_to_attribute",'d')
    event_id = request.get_json()
    Log("unsubscribing with id: "+str(event_id),'d');
    global session_proxy
    try:
        with thread_lock:
            global disable_Pytango
            if disable_Pytango:
                session_proxy.unsubscribe_event(event_id)
    except (CommunicationFailed,ConnectionFailed,DevFailed) as e:
        return jsonify(handleException(e))
    return jsonify(event_id)



@app.route('/REST/command_inout/<command>',methods=['POST'])
def command_inout(command):
    Log("in command_inout",'d')
    arg = request.get_json()
    Log(arg,'d')
    try:
        global disable_Pytango
        if disable_Pytango:
            ###_#p = DeviceProxy("sys/tg_test/1")
            encodedArg = arg #encodeArg(command,arg,p)
            if (encodedArg == 'null'):
                result ="" ###_#( p.command_inout(command))
            else:
                result ="" ###_#( p.command_inout(command, encodedArg))
            if isinstance(result, numpy.ndarray):
                result = result.tolist()
            elif isinstance(result,list):
                result = re.sub(r"([\d.]+)",r"'\1'",result.__str__())
            if app.testing:
                Log(json.dumps(result),'d')
        else:
            result = ""
        return jsonify(json.dumps(result))
    except (CommunicationFailed,ConnectionFailed,DevFailed) as e:
        return jsonify(handleException(e))

@app.route('/REST/test/',methods=['POST','PUT','GET'])
def testRest():
    print ("in testREST")
    if request.method == 'POST':
        Log("sended a POST response",'d')
        return jsonify(request.get_json())
    elif request.method == 'PUT':
        Log("sended a PUT response",'d')
        return jsonify(request.get_json())
    elif request.method == 'GET':
        Log("sended a GET response",'d')
        return jsonify({'data' : 'adgad'})

def parseAttribute(attribute):
    x1 = attribute.__str__()
    x2 = re.sub(r"\n", r";", x1)
    x3 = re.sub(r"[^_]value.*(w_dim_x)", r"\1", x2)#remove value object
    x4 = re.sub("'", "", x3)
    x5 = re.sub(r"DeviceAttribute\[;(.+)\];$", r"{\1}", x4)
    x6 = re.sub(r"\w+\(([\w\s=,]+)\)", r"{\1}", x5)
    x7 = re.sub(r";\s+w_value.*(})", r"\1", x6)
    x8 = re.sub(r"([\w.\-/]+)", r"'\1'", x7)
    x9 = re.sub(";", ",", x8)
    x10 = re.sub("=", ":", x9)
    x11 = ast.literal_eval(x10)
    val = attribute.value
    value = "";
    if isinstance(val,numpy.ndarray):
        value = val.tolist()
    else:
        value = val
    x11['value'] = value
    return x11

def parseCommandInfoList(data):
    x1 = data.__str__()
    x2 = re.sub(r"CommandInfo\(([^\)]+)\)", r"{\1}", x1)
    x3 = re.sub("'", "", x2)
    x4 = re.sub(r"([\w.\-/]+)", r"'\1'", x3)
    x5 = re.sub("=", ":", x4)
    return "" ###_#ast.literal_eval(x5)

def parseStdStringVector(data):
    x1 = data.__str__()
    return "" ###_#ast.literal_eval(x1)

@app.route('/REST/read_attribute/<attribute>')
def read_attribute(attribute):
    if app.testing:
        Log("in read_attribute",'d')
    try:
        global disable_Pytango
        if disable_Pytango:
            ######_####_#p = DeviceProxy("sys/tg_test/1")
            redAttribute ="" ###_#( p.read_attribute(attribute))
            response = parseAttribute(redAttribute)
        else:
            response = ""
        return jsonify(response)
    except (CommunicationFailed,ConnectionFailed,DevFailed) as e:
        return jsonify(handleException(e))

@app.route('/REST/get_property_list/')
def get_property_list():
    Log("in get_property_list",'d')
    try:
        global disable_Pytango
        if disable_Pytango:
            ###_#p = DeviceProxy("sys/tg_test/1")
            properties ="" ###_#( p.get_attribute_list())
            parsedProperties = [{},{},{}]###_#parseStdStringVector(properties)
        else:
            parsedProperties =""
        return jsonify(parsedProperties)
    except (CommunicationFailed, ConnectionFailed, DevFailed) as e:
        return jsonify(handleException(e))

@app.route('/REST/get_attribute_list/')
def get_attribute_list():
    Log("in get_attribute_list",'d')
    try:
        global disable_Pytango
        if disable_Pytango:
            ###_#p = DeviceProxy("sys/tg_test/1")
            attributes ="" ###_#( p.get_attribute_list())
            parsedAttributes = [{},{},{}]###_#parseStdStringVector(attributes)
        else:
            parsedAttributes = [{},{},{}]
        return jsonify(parsedAttributes)
    except (CommunicationFailed,ConnectionFailed,DevFailed) as e:
        return jsonify(handleException(e))

@app.route('/REST/command_list_query/')
def command_list_query():
    Log("in command_list_query",'d')
    try:
        global disable_Pytango
        if disable_Pytango:
            ###_#p = DeviceProxy("sys/tg_test/1")
            commands ="" ###_#( p.command_list_query())
            parsedCommands = [{},{},{}]###_#parseCommandInfoList(commands)
        else:
            parsedCommands=""
        return jsonify(parsedCommands)
    except (CommunicationFailed,ConnectionFailed,DevFailed) as e:
        return jsonify(handleException(e))

@app.route('/')
def index():
    return ""
 #   return render_template('index.html', async_mode=socketio.async_mode)
