from aiohttp import web
import asyncio
from threading import Lock
import socketio
from PyTango import DeviceProxy, EventType
import queue
from datetime import datetime
import re

log_level = "d"
events = queue.Queue()
thread = None
thread_lock = Lock()

socketio = socketio.AsyncServer()
app = web.Application()
socketio.attach(app)


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

async def background_thread():
    global events
    while True:
        await asyncio.sleep(100)
        event = events.get()
        if event:
            if (event.err != True):
                Log("emitting device event","d");
                await socketio.emit('device event', {'data': event.attr_value.value,'time': str(datetime.now())},
                        namespace='/test')
                await socketio.emit('__'+event.attr_value.name, {'data': event.attr_value.value, 'time': str(datetime.now())},
                              namespace='/test')
            else:
                errors = parseEventErrors(event.errors)
                await socketio.emit('device event error', {'data': errors,'time': str(datetime.now())},
                        namespace='/test')
            events.task_done()


def Log(message,type = 'd'):
    global log_level
    if log_level in type:
            print(message)

@socketio.on('ping to server', namespace='/test')
async def ping_to_server(sid):
    Log("ping to server received on: "+sid,'h')
    await socketio.emit('pong to client',namespace='/test')

@socketio.on('disconnect', namespace='/test')
def disconnect(sid):
    Log('Client disconnected for'+sid,'d')

@socketio.on('ping to device', namespace='/test')
async def ping_to_device(sid):
    Log('server asked to ping from device','h')
    p = DeviceProxy("sys/tg_test/1")
    elapsed_time = p.ping()
    await socketio.emit("pong from device", {'elapsed': elapsed_time},namespace='/test')

@socketio.on('connect', namespace='/test')
def connect(sid,data):
    Log('connection from client on '+sid,'d')
    #loop = asyncio.get_running_loop()
    asyncio.run(background_thread())
    #loop.run_until_complete(bckground_thread())
    #with thread_lock:
    #    global thread
    #    if thread is None:
    #        thread = socketio.start_background_task(target=background_thread)

async def subscribe(par):
    Log("in pub sub",'h')
    tango_test = DeviceProxy("sys/tg_test/1")
    callback = lambda event: events.put(event)
    event_id = tango_test.subscribe_event("Status", EventType.CHANGE_EVENT, callback, [], True)

app.on_startup.append(subscribe)


if __name__ == '__main__':
    web.run_app(app)
