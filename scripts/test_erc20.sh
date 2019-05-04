#! /bin/bash

set -e

cd ci 
bash init_geth.sh
geth_container=$(bash run.sh)
cd ..

echo "$(docker ps)"
echo "$(netstat -tulpn)"
docker run --network host -v $(pwd)/truffle:/project -t jwasinger/truffle sh -c "cd /project && truffle unbox metacoin && cp truffle-config.js metacoin && truffle migrate --network dev && truffle test --network dev"
