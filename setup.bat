@echo off
set DOCKER_NETWORK=docker-network
docker-compose -f docker-compose.tangobase.yaml up -d
docker-compose -f docker-compose.tango_gui.yaml up -d
docker build -t flaskio .