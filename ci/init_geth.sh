#! /bin/bash
mkdir data
docker run -v $(pwd)/genesis.json:/genesis.json -v $(pwd)/data:/data -t jwasinger/client-go:ewasm-hera  init /genesis.json --datadir /data
docker run -v $(pwd)/keys:/keys -v $(pwd)/data:/data -t jwasinger/client-go:ewasm-hera --datadir /data account import /keys/faucet/faucet-priv.txt --password /keys/faucet/faucet-pw.txt
