const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx')
const privateKey = Buffer.from('cbfee4ca4db6cf6120e50eff7033ed6c65168ae4bd93bb66788ed1f50ff270fb', 'hex')
const argv = require('yargs').argv;
const fs = require('fs')
const binaryen = require("binaryen");

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

function buf2hex(buffer) { // buffer is an ArrayBuffer
	return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function createTruffleConf(receipt, bytecode) {
	let conf_template = fs.readFileSync("truffle/WRC20.template.json", "utf-8")
	let conf = conf_template.replace(/DEPLOYED_BYTECODE/, bytecode).replace(/DEPLOYED_ADDRESS/, receipt.contractAddress).replace(/DEPLOYED_TX_HASH/, receipt.transactionHash);
	conf = Buffer.from(conf, 'utf-8');
	
	if (fs.existsSync("truffle/build/contracts/WRC20.json")) {
		fs.unlinkSync("truffle/build/contracts/WRC20.json")
	}

	fs.writeFileSync("truffle/build/contracts/WRC20.json", conf);
}

let wasmBytecode = buf2hex(fs.readFileSync(argv.wasm));
let bytecodeLen = wasmBytecode.length;
let formattedWasmBytecode = '';

for (let i = 0; i < wasmBytecode.length; i += 2) {
	formattedWasmBytecode += "\\" + wasmBytecode.slice(i, i + 2)
}

let wasmDeploymentWrapper = `(module (import "ethereum" "finish" (func $finish (param i32 i32))) (memory 100) (data (i32.const 0)  "${wasmBytecode}") (export "memory" (memory 0)) (export "main" (func $main)) (func $main (call $finish (i32.const 0) (i32.const ${bytecodeLen / 2}))))`

let deploymentBytecode = '0x'+buf2hex(binaryen.parseText(wasmDeploymentWrapper).emitBinary())

let nonce = '0';

const txParams = {
  nonce: '0x'+nonce,
  gasPrice: '0x174876e800', 
  gasLimit: '0x700000',
  to: '',
  value: '', 
  data: deploymentBytecode,
  chainId: 66
}

let tx = new EthereumTx(txParams)
tx.sign(privateKey)
let serializedTx = tx.serialize()

web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
	.on('receipt', function(receipt) {
		createTruffleConf(receipt, wasmBytecode);
	});
