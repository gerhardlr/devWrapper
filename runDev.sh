#!/usr/bin/env bash
cd dev/
export DEV=$(pwd)
cd ..
docker run -it --entrypoint /bin/bash --rm  --name=flaskio -p 127.0.0.1:5003:5000 --network=docker-network -v $DEV:/app flaskio