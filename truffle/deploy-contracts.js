const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx')
const privateKey = Buffer.from('cbfee4ca4db6cf6120e50eff7033ed6c65168ae4bd93bb66788ed1f50ff270fb', 'hex')
const argv = require('yargs').argv;
const fs = require('fs')
const binaryen = require("binaryen");
const request = require('request');
const wabt = require("wabt")();
const tmp = require('tmp');
const Readable = require('stream').Readable;
const s = new Readable();

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
const DEPLOYMENT_ADDRESS = "7976977ecf72519e656a27c16b8c406329e46b78"

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

let wasmBytecode = buf2hex(binaryen.readBinary(Uint8Array.from(fs.readFileSync(argv.wasm))).emitBinary()) //buf2hex(fs.readFileSync(argv.wasm));
//let wasmBytecode = buf2hex(fs.readFileSync(argv.wasm))


let bytecodeLen = wasmBytecode.length;
let formattedWasmBytecode = '"';

for (let i = 0; i < wasmBytecode.length; i += 2) {
	formattedWasmBytecode += "\\" + wasmBytecode.slice(i, i + 2)
}

formattedWasmBytecode += '"';

let wasmDeploymentWrapper = `(module 
	(import "ethereum" "finish" (func $finish (param i32 i32)))
	(import "ethereum" "storageStore" (func $storageStore (param i32 i32)))
	(memory 1) 
 (data (i32.const 0)  "\\ed\\09\\37\\5d\\c6\\b2\\00\\50\\d2\\42\\d1\\61\\1a\\f9\\7e\\e4\\a6\\e9\\3c\\ad\\00\\00\\00\\00\\00\\00\\00\\00\\00\\00\\00\\00")
 (data (i32.const 32)  "\\00\\00\\00\\00\\00\\00\\00\\00\\00\\00\\00\\00\\00\\00\\00\\00\\00\\00\\00\\00\\01\\00\\00\\00\\00\\00\\00\\00\\00\\00\\00\\00")
 (data (i32.const 64)  ${formattedWasmBytecode}) 
(export "memory" (memory 0)) 
(export "main" (func $main)) 
	(func $main 
		(call $storageStore (i32.const 0) (i32.const 32)) 
		(call $finish (i32.const 64) (i32.const ${bytecodeLen / 2}))))`

console.log(wasmDeploymentWrapper)
/*

s._read = () => {}; // redundant? see update below
s.push(wasmDeploymentWrapper);
s.push(null);

var tmpobj = tmp.fileSync();
debugger

var writeStream = fs.createWriteStream(null, {fd: tmpobj.fd});
//writeStream.pipe(s);
s.pipe(writeStream)



let ret = wabt.parseWat(tmp.name)
debugger
let bin = ret.parseBinary()

tmp.removeCallback()


if (!ret.buffer) {
 console.log(ret.log)
}
*/

// let deploymentBytecode = '0x'+buf2hex(ret.buffer)
let deploymentBytecode = '0x'+buf2hex(binaryen.parseText(wasmDeploymentWrapper).emitBinary())
console.log(deploymentBytecode)

let nonce = web3.eth.getTransactionCount(DEPLOYMENT_ADDRESS).then (nonce => {
	const txParams = {
	  nonce: '0x'+nonce,
	  gasPrice: '0x174876e8000', 
	  gasLimit: '0x700000',
	  to: '',
	  value: '', 
	  data: deploymentBytecode,
	  chainId: 66
	}

	let tx = new EthereumTx(txParams)
	tx.sign(privateKey)
	let serializedTx = tx.serialize()

	/*
	var options = {
	  url: 'http://localhost:8545',
	  method: 'POST',
	  json: {
	    jsonrpc: "2.0",
	    method: "eth_sendRawTransaction",
	    id: 1,
	    params: [
	      serializedTx
	    ]
	  }
	};

	request(options, function (error, response, body) {
	  if (error) {
	    console.log("error: ")
	    console.log(error)
	  }

	  if (!error && response.statusCode == 200) {
	    console.log(body) // Print the shortened url.
	  }
	});
	*/

	console.log("sending signed transaction...")
	web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
		.on('receipt', function(receipt) {
   web3.eth.getCode(/*receipt.contractAddress*/"0x8013314ea35839f2bb351c1efd2c163964ec3a3e").then(console.log)
			console.log("got receipt")
			createTruffleConf(receipt, wasmBytecode);
		})
		.on('error', function(err) {
			console.log(err)
		});
});
