# devWrapper
<h3> to start up tango environment </h3>
<p> sh setup.sh </p>
<h3> to run server container </h3>
<p> sh runDev.sh </p>
<h3> then... </h3>
<p> to start client: open up a new shell </p>
<p> type in: docker exec -it flaskio bash </p>
<p> type in: cd /client/dev-client/ </p>
<p> type in: npm start </p>

to test client open browser at: <br>
http://localhost:3000/ <br>

to stimulate changes to tango test device use tango GUI at: <br>
http://localhost:6901/?password=vncpassword <br>
to change dev container (Dockerfile) and run: docker build -t flaskio .

The webser API has the following sockets commands
<h2> Receive Events: </h2>
<h3> C.1 'device event ack' <h3>
<b> Description:</b> Send by client to confirm an "device event ack has been send"
<b> Stateless/Statefull </b> Statefull: expected a "device event" (see R.1) have been send
<h3> C.2 'disconnect_request' <h3>
<b> Description:</b> Send by client to request socket to be closed - will always result in a 'socket disconnected' response (see R.2)
<b> Stateless/Statefull </b> Statefull: must send a R.2 response
<h3> C.3 'ping to server' <h3>
<b> Description:</b> Send by client to for testing purposes- will always result in a 'pong to client' response (see R.3)
<b> Stateless/Statefull </b> Statefull: must send a R.3 response
<h3> C.4 'ping to device' <h3>
<b> Description:</b> Send by similar to C.3 but this time the piong is passed on the a TANGO device
- will always result in a 'pong from device' response (see R.4)
<h3> C.4 'ping to device' <h3>
<b> Description:</b> Send by similar to C.3 but this time the piong is passed on the a TANGO device
- will always result in a 'pong from device' response (see R.4)
<b> Stateless/Statefull </b> Statefull: must send a R.4 response<b> Stateless/Statefull </b> Statefull: must send a R.4 response

<h2> Emmit Events: </h2>
<h3> R.1 'device event' <h3>
<b> Description:</b> General event signifying another specific device event have been send (for logging purposes)
<b> Stateless/Statefull </b> Statefull: will use a "device event ack" (see C.1) have been send to measure latency and health
<h3> R.2 'socket disconnected' <h3>
<b> Description:</b> send as a response to a disconnect request (<b>not</b> when an error caused the socket to disconnect)
<b> Stateless/Statefull </b> Statefull: client expect this as a response to message C.2
<h3> R.3 'pong to client' <h3>
<b> Description:</b> An echo message as response after receiving a C.3 for health and latency measurement
<b> Stateless/Statefull </b> Statefull: client expect this as a response to message C.3
<h3> R.4 'pong from device' <h3>
<b> Description:</b> The server is expected to echo back after it has successfully pinged a TANGO device in response to message C.4
<b> Stateless/Statefull </b> Statefull: clients expect this as a response to message C.4
