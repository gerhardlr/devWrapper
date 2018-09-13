docker-compose -f docker-compose.tango_gui.yml down --remove-orphans
docker-compose -f docker-compose.tangobase.yml down --remove-orphans
docker network remove docker-network