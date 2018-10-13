#!/usr/bin/env bash
cd eventBasedServer/
docker run -it --entrypoint /bin/bash --rm  --name=dev_server -p 127.0.0.1:5000:5000 --network=docker-network -v "$(pwd)":/server dev_server2
