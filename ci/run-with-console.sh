#! /bin/bash
set -e

docker run -i --network host -v $(pwd)/.ethash:/root/.ethash:Z -v $(pwd)/data:/data -v $(pwd)/keys:/keys -t ethereum/client-go \
	--etherbase $(cat keys/faucet/faucet-addr.txt) \
	--networkid 66 \
	--nodiscover \
	--gcmode "archive" \
	--mine \
	--miner.threads 1 \
	--vmodule "rpc=12" \
	--datadir /data \
	--unlock $(cat keys/faucet/faucet-addr.txt) \
	--rpc \
	--rpcapi 'eth,net,debug' \
	--rpcaddr '127.0.0.1' \
	--rpcport 8545 \
	--rpccorsdomain '*' \
	--ws \
	--wsaddr '0.0.0.0' \
	--wsorigins '*' \
	--password /keys/faucet/faucet-pw.txt \
	--vm.ewasm="/root/libhera.so,metering=false" \
	--verbosity 0 \
	--allow-insecure-unlock \
	console

	#--mine \
	#--miner.threads 1 \
