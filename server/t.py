#!/usr/bin/env python

from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect

from datetime import datetime

async_mode = "threading"

app = Flask(__name__)

socketio = SocketIO(app, async_mode=async_mode)





@socketio.on('ping to server', namespace='/test')
def ping_to_server():
    print("ping received")
    emit('ping to server',{'data':'date'})

@app.route('/')
def index():
    return ""
 #   return render_template('index.html', async_mode=socketio.async_mode)


if __name__ == '__main__':

    socketio.run(app, debug=True)




