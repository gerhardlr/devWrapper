echo off
cd client/dev-client/
docker run -it --entrypoint /bin/bash --rm  --name=dev_client -p 127.0.0.1:3000:3000 --network=docker-network -v "%cd%":/dev-client dev_client