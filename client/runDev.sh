#!/usr/bin/env bash
cd dev/
export DEV=$(pwd)
cd ..
cd client/
export CLIENT=$(pwd)
cd ..
docker run -it --entrypoint /bin/bash --rm  --name=flaskio -p 127.0.0.1:5003:5000 -p 127.0.0.1:3000:3000 --network=docker-network -v $DEV:/app -v $CLIENT:/client flaskio