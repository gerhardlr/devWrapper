export DOCKER_NETWORK=docker-network
export DEV=$(pwd)
docker-compose -f docker-compose.tango_gui.yaml down --remove-orphans
docker-compose -f docker-compose.tangobase.yaml down --remove-orphans
docker stop dev
docker network emove docker-network