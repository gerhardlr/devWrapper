#!/usr/bin/env bash
docker network create docker-network
export DOCKER_NETWORK=docker-network
docker-compose -f docker-compose.tangobase.yaml up -d
docker-compose -f docker-compose.tango_gui.yaml up -d

docker build -t flaskio .
#cd dev/
#export DEV_HOME=$(pwd)
#cd ..`

#docker-compose -f docker-compose.dev.yml up -d
#docker run -d --name=dev --network=$DOCKER_NETWORK -v$DEV_HOME:/app --rm dev