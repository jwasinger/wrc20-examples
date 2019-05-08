#! /bin/bash
set -e

docker run -d --network host -v $(pwd)/data:/data -v $(pwd)/keys:/keys -t jwasinger/client-go:ewasm-hera \
	--etherbase $(cat keys/faucet/faucet-addr.txt) \
	--mine \
	--miner.threads 1 \
	--networkid 66 \
	--nodiscover \
	--vmodule "miner=12" \
	--datadir /data \
	--unlock $(cat keys/faucet/faucet-addr.txt) \
	--rpc \
	--rpcaddr '127.0.0.1' \
	--rpcport 8545 \
	--rpccorsdomain '*' \
	--ws \
	--wsaddr '0.0.0.0' \
	--wsorigins '*' \
	--password /keys/faucet/faucet-pw.txt \
	--vm.ewasm="/home/builder/libhera.so,fallback=true,metering=false"
