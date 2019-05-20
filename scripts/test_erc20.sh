#! /bin/bash

set -e

cd ci 
bash init_geth.sh
geth_container=$(bash run.sh)
cd ..

docker run -v $(pwd)/truffle:/truffle:z -t jwasinger/truffle sh -c "cd /truffle && npm install"

for filename in build/*.wasm; do
    [ -e "$filename" ] || continue
    docker run --network host -v $(pwd)/$filename:/build/wrc20.wasm -v $(pwd)/truffle:/truffle -t jwasinger/truffle sh -c "node truffle/deploy-contracts.js --wasm /build/wrc20.wasm && cd truffle && truffle test --network dev"
done
