echo off
cd server/
docker run -it --entrypoint /bin/bash --rm  --name=dev_server -p 127.0.0.1:5000:5000 --network=docker-network -v "%cd%":/server dev_server