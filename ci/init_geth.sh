#! /bin/bash

if [ -d "hera" ]; then rm -Rf hera; fi

mkdir -p hera
(cd hera && wget https://github.com/ewasm/hera/releases/download/v0.2.3/hera-0.2.3-linux-x86_64.tar.gz && tar -xvf hera-0.2.3-linux-x86_64.tar.gz && cp lib/libhera.so .)

mkdir data
docker run -v $(pwd)/genesis.json:/genesis.json -v $(pwd)/data:/data -t jwasinger/client-go:ewasm  init /genesis.json --datadir /data
docker run -v $(pwd)/keys:/keys -v $(pwd)/data:/data -t jwasinger/client-go:ewasm --datadir /data account import /keys/faucet/faucet-priv.txt --password /keys/faucet/faucet-pw.txt
