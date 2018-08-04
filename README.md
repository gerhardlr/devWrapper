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

