#!/usr/bin/env python
from threading import Lock,Event
import json
from flask import Flask, render_template, session, request,jsonify, Response
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from PyTango import DeviceProxy,GreenMode, DevState, DevFailed,CommunicationFailed,ConnectionFailed,\
    CmdArgType,AttributeProxy, Database
from PyTango import EventType
from datetime import datetime
import Queue
import re
import ast
import numpy
import sys

import traceback
from PyTango import set_green_mode, get_green_mode
from flask import g

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.

async_mode = 'threading'

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app, async_mode=async_mode)
thread = None
stop_thread = Event()
events = Queue.Queue()
thread_lock = Lock()
app.count = 0
session_proxy = None

import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)


#### publisch subscribe sectiion
@app.before_first_request
def function_to_run_only_once():
    pass
    #print("in pub sub")
    #tango_test = DeviceProxy("sys/tg_test/1")
    #callback = lambda event: events.put(event)
    #event_id = tango_test.subscribe_event("Status", EventType.CHANGE_EVENT, callback, [], True)

def close_thread():
    print("closing thread")
    global stop_thread
    stop_thread.set()

def parseEventErrors(errors):
    x = errors.__str__()
    x1 = re.sub(r"DevError\((.+?)\),(?<=\),)", r"{\1}", x)
    x2 = re.sub(r"DevError\((.+?)\)\)(?<=\)\))", r"{\1}", x1)
    x3 = re.sub(r"^\(({.+}$)", r"\1", x2)
    x4 = re.sub(r"(?<=})\s*(?={)", ";", x3)
    x5 = re.sub(r"=", ":", x4)
    x6 = re.sub(r"'", "", x5)
    x7 = re.sub(r"(?<=:\s)(.+?)\s*(?=[,}])", r"'\1'", x6)
    x8 = re.sub(r"(?<=[{,])\s*(.+?)\s*(?=[:])", r"'\1'", x7)
    x8 = re.sub(r"(.+)", r"[\1]", x8)
    x9 = re.sub(";", ",", x8)
    x10 = ast.literal_eval(x9)
    return x10






def background_thread():
    global events
    global stop_thread
    while True: #stop_thread.is_set:
        event = events.get()
        if event:
            if (event.err != True):
                socketio.emit('device event', {'data': event.attr_value.value,'time': str(datetime.now())},
                        namespace='/test')
                socketio.emit('__'+event.attr_value.name, {'data': event.attr_value.value, 'time': str(datetime.now())},
                              namespace='/test')
            else:
                errors = parseEventErrors(event.errors)
                socketio.emit('device event error', {'data': errors,'time': str(datetime.now())},
                        namespace='/test')


        events.task_done()

####socket io section
@socketio.on('device event ack', namespace='/test')
def dev_event_ack(message):
    print("event acknowledged received at:" + str(datetime.now())+ ", event send at: " +message['time'])


@socketio.on('disconnect_request', namespace='/test')
def disconnect_request():
    print("socket disconnect request received at" + str(datetime.now()))
    emit('socket disconnected',
         {'data': 'Disconnected!', 'time' :str(datetime.now())} )
    disconnect()


@socketio.on('ping to server', namespace='/test')
def ping_to_server():
    print("ping to server received")
    emit('pong to client')

@socketio.on('ping to device', namespace='/test')
def ping_to_device():
    print('server asked to ping from device')
    p = DeviceProxy("sys/tg_test/1")
    elapsed_time = p.ping()
    emit("pong from device", {'elapsed': elapsed_time})
    print('client ponged from device')

@socketio.on('connect', namespace='/test')
def test_connect():
    global thread
    global session_proxy
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_thread)
        session_proxy = DeviceProxy("sys/tg_test/1")
    emit('socket connected', {'data': 'Connected', 'count': 0 , 'time' :str(datetime.now())})

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected', request.sid)

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
        print("exception caught")
        print(response)
    return response

def encodeArg(command,arg,p):
    #TODO

    commandInfo = p.command_query(command)
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
    print("in subscribe_to_attribute")
    global events
    session_proxy
    callback = lambda event: events.put(event)
    data = request.get_json()
    attribute = data['attribute'].encode("utf-8")
    polling = int(data['polling'])
    print("setting subscription for "+attribute+" to polling period of "+str(polling))
    try:
        with thread_lock:
            session_proxy.poll_attribute(attribute,polling)
            event_id = session_proxy.subscribe_event(attribute, EventType.PERIODIC_EVENT, callback, [], True)
        #3 session_proxy.unsubscribe_event(event_id)

    except (CommunicationFailed,ConnectionFailed,DevFailed) as e:
        return jsonify(handleException(e))
    return jsonify(event_id)

@app.route('/REST/unsubscribe_to_attribute',methods =['PUT'])
def unsubscribe_to_attribute():
    print("in unsubscribe_to_attribute")
    event_id = request.get_json()
    print("unsubscribing with id: "+str(event_id));
    global session_proxy
    try:
        with thread_lock:
            session_proxy.unsubscribe_event(event_id)
    except (CommunicationFailed,ConnectionFailed,DevFailed) as e:
        return jsonify(handleException(e))
    return jsonify(event_id)



@app.route('/REST/command_inout/<command>',methods=['POST'])
def command_inout(command):
    print("in command_inout")
    arg = request.get_json()
    print(arg)
    try:
        p = DeviceProxy("sys/tg_test/1")
        encodedArg = arg #encodeArg(command,arg,p)
        if (encodedArg == 'null'):
            result = p.command_inout(command)
        else:
            result = p.command_inout(command, encodedArg)
        if isinstance(result, numpy.ndarray):
            result = result.tolist()
        elif isinstance(result,list):
            result = re.sub(r"([\d.]+)",r"'\1'",result.__str__())
        if app.testing:
            print(json.dumps(result))
        return jsonify(json.dumps(result))
    except (CommunicationFailed,ConnectionFailed,DevFailed) as e:
        return jsonify(handleException(e))

@app.route('/REST/test/',methods=['POST','PUT','GET'])
def testRest():
    print ("in testREST")
    if request.method == 'POST':
        print("sended a POST response")
        return jsonify(request.get_json())
    elif request.method == 'PUT':
        print("sended a PUT response")
        return jsonify(request.get_json())
    elif request.method == 'GET':
        print("sended a GET response")
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
    return ast.literal_eval(x5)

def parseStdStringVector(data):
    x1 = data.__str__()
    return ast.literal_eval(x1)

@app.route('/REST/read_attribute/<attribute>')
def read_attribute(attribute):
    if app.testing:
        print("in read_attribute")
    try:
        p = DeviceProxy("sys/tg_test/1")
        redAttribute = p.read_attribute(attribute)
        response = parseAttribute(redAttribute)
        return jsonify(response)
    except (CommunicationFailed,ConnectionFailed,DevFailed) as e:
        return jsonify(handleException(e))

@app.route('/REST/get_property_list/')
def get_property_list():
    print("in get_property_list")
    try:
        p = DeviceProxy("sys/tg_test/1")
        properties = p.get_attribute_list()
        parsedProperties = parseStdStringVector(properties)
        return jsonify(parsedProperties)
    except (CommunicationFailed, ConnectionFailed, DevFailed) as e:
        return jsonify(handleException(e))

@app.route('/REST/get_attribute_list/')
def get_attribute_list():
    print("in get_attribute_list")
    try:
        p = DeviceProxy("sys/tg_test/1")
        attributes = p.get_attribute_list()
        parsedAttributes = parseStdStringVector(attributes)
        return jsonify(parsedAttributes)
    except (CommunicationFailed,ConnectionFailed,DevFailed) as e:
        return jsonify(handleException(e))

@app.route('/REST/command_list_query/')
def command_list_query():
    print("in command_list_query")
    try:
        p = DeviceProxy("sys/tg_test/1")
        commands = p.command_list_query()
        parsedCommands = parseCommandInfoList(commands)
        return jsonify(parsedCommands)
    except (CommunicationFailed,ConnectionFailed,DevFailed) as e:
        return jsonify(handleException(e))

@app.route('/')
def index():
    return ""
 #   return render_template('index.html', async_mode=socketio.async_mode)


if __name__ == '__main__':

    socketio.run(app, debug=True)
   # tango_test = DeviceProxy("sys/tg_test/1")
   # event_id = tango_test.subscribe_event("Status", EventType.CHANGE_EVENT, callback, [], True)




