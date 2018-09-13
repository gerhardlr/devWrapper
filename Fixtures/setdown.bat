@echo off
docker-compose -f docker-compose.tango_gui.yml --remove-orphans down
docker-compose -f docker-compose.tangobase.yml --remove-orphans down
docker network remove docker-network