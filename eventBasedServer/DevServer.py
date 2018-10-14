from aiohttp import web
import socketio

socketio = socketio.AsyncServer()
app = web.Application()
socketio.attach(app)

async def index(request):
    """Serve the client-side application."""
    with open('index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')

@socketio.on('ping',namespace='/test')
def def_ping():
    print("ping received")

@socketio.on('connect', namespace='/chat')
def connect(sid, environ):
    print("connect ", sid)

@socketio.on('chat message', namespace='/chat')
async def message(sid, data):
    print("message ", data)
    await ocketio.emit('reply', room=sid)

@socketio.on('disconnect', namespace='/chat')
def disconnect(sid):
    print('disconnect ', sid)

#app.router.add_static('/static', 'static')
#app.router.add_get('/', index)

if __name__ == '__main__':
    web.run_app(app)
