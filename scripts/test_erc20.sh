#! /bin/bash

set -e

cd ci 
bash init_geth.sh
geth_container=$(bash run.sh)
cd ..

docker run --network host -v $(pwd)/src/C/wrc20.wasm:/build/wrc20.wasm -v $(pwd)/truffle:/truffle -t jwasinger/truffle sh -c "node truffle/deploy-contracts.js --wasm /build/wrc20.wasm && cd truffle && truffle test --network dev"
