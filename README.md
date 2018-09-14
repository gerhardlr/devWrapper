# devWrapper
<h3> to start up test fixture (tango environment) </h3>
<p> <b>Linux based</b> sh setUpFixtures.sh (to shutdown use setDownFixtures.sh) </p>
<p> <b>DOS based</b> setUpFixtures.bat(to shutdown use setDownFixtures.bat) </p>
<h3> to build server side </h3>
<p> <b>Linux based</b> sh buildServer.sh </p>
<p> <b>DOS based</b> buildServer.bat </p>
<h3> to build client side </h3>
<p> <b>Linux based</b> sh buildClient.sh </p>
<p> <b>DOS based</b> buildClient.bat </p>
<h3> to run server side </h3>
<p> <b>Linux based</b> sh runServer.sh -> flask run --host=0.0.0.0 </p>
<p> <b>DOS based</b> runServer.bat -> flask run --host=0.0.0.0 </p>
<h3> to run client side </h3>
<p> <b>Linux based</b> sh runClient.sh -> npm start </p>
<p> <b>DOS based</b> runClient.bat -> npm start </p>

to test client open browser at: <br>
http://localhost:3000/ <br>

to stimulate changes to tango test device use tango GUI at: <br>
http://localhost:6901/?password=vncpassword <br>
to change dev container (Dockerfile) and run: docker build -t flaskio .

The webser API has the following sockets commands
<h2> Receive Events: </h2>
<h3> C.1 'device event ack' </h3>
<p>
<b> Description:</b> Send by client to confirm an "device event ack has been send"
</p>
<p>
<b> Stateless/Statefull </b> Statefull: expected a "device event" (see R.1) have been send
</p>
<h3> C.2 'disconnect_request' </h3>
<p>
<b> Description:</b> Send by client to request socket to be closed - will always result in a 'socket disconnected' response (see R.2)
 </p>
<p>
<b> Stateless/Statefull </b> Statefull: must send a R.2 response
</p>
<h3> C.3 'ping to server' </h3>
<p>
<b> Description:</b> Send by client to for testing purposes- will always result in a 'pong to client' response (see R.3)
</p>
<p>
<b> Stateless/Statefull </b> Statefull: must send a R.3 response
</p>
<h3> C.4 'ping to device' </h3>
<p>
<b> Description:</b> Send by similar to C.3 but this time the piong is passed on the a TANGO device
- will always result in a 'pong from device' response (see R.4)
</p>
<p>
<b> Stateless/Statefull </b> Statefull: must send a R.4 response<b> Stateless/Statefull </b> Statefull: must send a R.4 response

<h2> Emmit Events: </h2>
<h3> R.1 'device event' </h3>
<p>
<b> Description:</b> General event signifying another specific device event have been send (for logging purposes)
</p>
<p>
<b> Stateless/Statefull </b> Statefull: will use a "device event ack" (see C.1) have been send to measure latency and health
</p>
<h3> R.2 'socket disconnected' </h3>
<p>
<b> Description:</b> send as a response to a disconnect request (<b>not</b> when an error caused the socket to disconnect)
</p>
<p>
<b> Stateless/Statefull </b> Statefull: client expect this as a response to message C.2
</p>
<h3> R.3 'pong to client' </h3>
<p>
<b> Description:</b> An echo message as response after receiving a C.3 for health and latency measurement
</p>
</p>
<p>
<b> Stateless/Statefull </b> Statefull: client expect this as a response to message C.3
</p>
<h3> R.4 'pong from device' </h3>
<p>
<b> Description:</b> The server is expected to echo back after it has successfully pinged a TANGO device in response to message C.4
</p>
<p>
<b> Stateless/Statefull </b> Statefull: clients expect this as a response to message C.4
</p>
