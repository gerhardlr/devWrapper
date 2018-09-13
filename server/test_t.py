import t

if __name__ == '__main__':
    app = t.app
    app.testing = True
    client = app.test_client()
    socket_app = t.socketio.test_client(app)
    print(socket_app.emit('ping to sever', namespace='/test'))
    print(socket_app.get_received(namespace='/test'))








