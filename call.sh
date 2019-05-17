#! /bin/bash

curl -H "Content-type: application/json" -X POST --data '{ "jsonrpc": "2.0", "id": 1, "method": "eth_call", "params": [ { "from": "0x7976977ecf72519e656a27c16b8c406329e46b78", "gas": "0x6691b7", "gasPrice": "0x4a817c800", "to": "0x8013314ea35839f2bb351c1efd2c163964ec3a3e", "data": "0xe3d670d70000000000000000000000008013314ea35839f2bb351c1efd2c163964ec3a3e" }, "latest" ] }' http://127.0.0.1:8545
