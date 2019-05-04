#! /bin/bash

set -e

cd ci 
geth_container=$(bash run.sh)
cd ..

docker run --network host -v $(pwd)/truffle:/project -t jwasinger/truffle sh -c "cd /project && npm install --unsafe-perm && truffle test --network dev"
