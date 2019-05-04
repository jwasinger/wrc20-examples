#! /bin/bash
mkdir data
geth init ./genesis.json --datadir ./data
geth --datadir ./data account import ./keys/faucet/faucet-priv.txt --password ./keys/faucet/faucet-pw.txt
