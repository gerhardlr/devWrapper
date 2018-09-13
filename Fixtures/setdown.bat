@echo off
docker-compose -f docker-compose.tango_gui.yml down
docker-compose -f docker-compose.tangobase.yml down
docker network remove docker-network