#!/usr/bin/env bash
cd eventBasedServer/
docker run -it --entrypoint /bin/bash --rm  --name=dev_server -p 0.0.0.0:5000:8080 --network=docker-network -v "$(pwd)":/server dev_server2
