#! /bin/bash
set -e

docker run -d -v $(pwd)/data:/data -v $(pwd)/keys:/keys -p 8545:8545 -p 8546:8546 -p 30303:30303/udp -t jwasinger/client-go:ewasm \
	--etherbase $(cat keys/faucet/faucet-addr.txt) \
	--mine \
	--miner.threads 1 \
	--networkid 66 \
	--nodiscover \
	--vmodule "miner=12" \
	--datadir /data \
	--unlock $(cat keys/faucet/faucet-addr.txt) \
	--rpc \
	--rpcaddr '0.0.0.0' \
	--rpcport 8545 \
	--rpccorsdomain '*' \
	--ws \
	--wsaddr '0.0.0.0' \
	--wsorigins '*' \
	--password /keys/faucet/faucet-pw.txt \
	--vm.ewasm="$(pwd)/libhera.so,fallback=true,metering=true"
