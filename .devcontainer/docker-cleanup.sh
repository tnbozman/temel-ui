#!/bin/bash

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker volume prune -f
docker network prune -f
# docker system prune -a
# docker system df