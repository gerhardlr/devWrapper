#!/usr/bin/env python
from threading import Lock
from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from PyTango import DeviceProxy
from PyTango import EventType
from datetime import datetime
import Queue

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
    global events
    print("callback called:" + str(datetime.now()))
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


@app.route('/')
def index():
    return render_template('index.html', async_mode=socketio.async_mode)

@socketio.on('device event ack', namespace='/test')
def dev_event_ack(message):
    print("event acknowledged received at:" + str(datetime.now())+ ", event send at: " +message['time'])


@socketio.on('disconnect_request', namespace='/test')
def disconnect_request():
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('device event',
         {'data': 'Disconnected!', 'count': session['receive_count'], 'time' :str(datetime.now()) })
    disconnect()


@socketio.on('my_ping', namespace='/test')
def ping_pong():
    emit('my_pong')


@socketio.on('connect', namespace='/test')
def test_connect():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_thread)
    emit('device event', {'data': 'Connected', 'count': 0 , 'time' :str(datetime.now())})


@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected', request.sid)

#@app.before_first_request
#def subscribe():


if __name__ == '__main__':
    #tango_test = DeviceProxy("sys/tg_test/1")
    #event_id = tango_test.subscribe_event("Status", EventType.CHANGE_EVENT, callback, [], True)
    socketio.run(app, debug=True)
   # tango_test = DeviceProxy("sys/tg_test/1")
   # event_id = tango_test.subscribe_event("Status", EventType.CHANGE_EVENT, callback, [], True)




