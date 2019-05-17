#! /bin/bash

docker rm -f $(docker ps -qa)
sudo rm -rf data
./init_geth.sh
docker logs --follow $(./run.sh)
