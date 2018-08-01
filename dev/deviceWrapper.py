#!/usr/bin/env python
from threading import Lock
import json
from flask import Flask, render_template, session, request,jsonify, Response
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from PyTango import DeviceProxy,GreenMode
from PyTango import EventType
from datetime import datetime
import Queue
import re
import ast
import traceback
from PyTango import set_green_mode, get_green_mode
from flask import g

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.

async_mode = "threading"

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app, async_mode=async_mode)
thread = None
events = Queue.Queue()
thread_lock = Lock()
app.count = 0

#### publisch subscribe section

def callback(event):
    print("callback event called")
    global events
    events.put(event)

tango_test = DeviceProxy("sys/tg_test/1")
event_id = tango_test.subscribe_event("Status", EventType.CHANGE_EVENT, callback, [], True)

def background_thread():
    """Example of how to send server generated events to clients."""
    global events
    while True:
        event = events.get()
        if event:
            print("emit device event called: " + str(datetime.now()))
            socketio.emit('device event', {'data': event.attr_value.value, 'count': 0, 'time': str(datetime.now())},
                      namespace='/test')
        events.task_done()

####socket io section
@socketio.on('device event ack', namespace='/test')
def dev_event_ack(message):
    print("event acknowledged received at:" + str(datetime.now())+ ", event send at: " +message['time'])

@socketio.on('device event ack', namespace='/test')
def dev_event_ack(message):
    print("socket connect acknowledged received at:" + str(datetime.now())+ ", event send at: " +message['time'])

@socketio.on('disconnect_request', namespace='/test')
def disconnect_request():
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('device event',
         {'data': 'Disconnected!', 'count': session['receive_count'], 'time' :str(datetime.now()) })
    disconnect()

@socketio.on('ping to server', namespace='/test')
def ping_pong():
    print("pong emmitted")
    emit('pong to client')

@socketio.on('ping to device', namespace='/test')
def dev_ping_pong():
    print('server asked to ping from device')
    p = DeviceProxy("sys/tg_test/1")
    elapsed_time = p.ping()
    emit("pong from device", {'elapsed': elapsed_time})
    print('client ponged from device')

@socketio.on('connect', namespace='/test')
def test_connect():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_thread)
    emit('socket connected', {'data': 'Connected', 'count': 0 , 'time' :str(datetime.now())})

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected', request.sid)

####REST API section

@app.route('/command_inout/<command>',methods=['POST'])
def command_inout(command):
    print("in command_inout")
    p = DeviceProxy("sys/tg_test/1")
    args = request.get_json()
    #result = p.command_inout(command)
    print(args)
    return jsonify(args)

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
    x2 = re.sub(r"\n", r",", x1)
    x3 = re.sub("'", "", x2)
    x4 = re.sub(r"DeviceAttribute\[,([\w.\-/\s=,'\(\)]+)],", r"{\1}", x3)
    x5 = re.sub(r"\w+\(([\w\s=,]+)\)", r"{\1}", x4)
    x6 = re.sub(r"([\w.\-/]+)", r"'\1'", x5)
    x7 = re.sub("=", ":", x6)
    return ast.literal_eval(x7)

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
    print("in read_attribute")
    p = DeviceProxy("sys/tg_test/1")
    attribute = p.read_attribute(attribute)
    parsedAttribute = parseAttribute(attribute)
    return jsonify(parsedAttribute)

@app.route('/REST/get_property_list/')
def get_property_list():
    print("in get_property_list")
    p = DeviceProxy("sys/tg_test/1")
    properties = p.get_attribute_list()
    parsedProperties = parseStdStringVector(properties)
    return jsonify(parsedProperties)

@app.route('/REST/get_attribute_list/')
def get_attribute_list():
    print("in get_attribute_list")
    p = DeviceProxy("sys/tg_test/1")
    attributes = p.get_attribute_list()
    parsedAttributes = parseStdStringVector(attributes)
    return jsonify(parsedAttributes)

@app.route('/REST/command_list_query/')
def command_list_query():
    print("in command_list_query")
    p = DeviceProxy("sys/tg_test/1")
    commands = p.command_list_query()
    parsedCommands = parseCommandInfoList(commands)
    return jsonify(parsedCommands)

@app.route('/')
def index():
    pass
 #   return render_template('index.html', async_mode=socketio.async_mode)


if __name__ == '__main__':
    #tango_test = DeviceProxy("sys/tg_test/1")
    #event_id = tango_test.subscribe_event("Status", EventType.CHANGE_EVENT, callback, [], True)
    socketio.run(app, debug=True)
   # tango_test = DeviceProxy("sys/tg_test/1")
   # event_id = tango_test.subscribe_event("Status", EventType.CHANGE_EVENT, callback, [], True)




