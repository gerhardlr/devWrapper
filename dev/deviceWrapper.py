#!/usr/bin/env python
from threading import Lock
from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from PyTango import DeviceProxy,GreenMode
from PyTango import EventType
from datetime import datetime
import Queue
import traceback
from PyTango import set_green_mode, get_green_mode
from flask import g

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.

async_mode = "threading"

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app, async_mode=async_mode)
thread = None
events = Queue.Queue()
thread_lock = Lock()
app.count = 0



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

@app.route('/command/<command>')
def command(command):
    print("in command at  "+str(datetime.now()) )
    tango_test = DeviceProxy("sys/tg_test/1")
    result = tango_test.command_inout(command)
    print("result  generated at "+str(datetime.now())+"result: "+result)
    return result




@app.route('/')
def index():
    pass
 #   return render_template('index.html', async_mode=socketio.async_mode)

@app.route('/client/')
def client():
    return render_template('clock.js', async_mode=socketio.async_mode)


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



if __name__ == '__main__':
    #tango_test = DeviceProxy("sys/tg_test/1")
    #event_id = tango_test.subscribe_event("Status", EventType.CHANGE_EVENT, callback, [], True)
    socketio.run(app, debug=True)
   # tango_test = DeviceProxy("sys/tg_test/1")
   # event_id = tango_test.subscribe_event("Status", EventType.CHANGE_EVENT, callback, [], True)




