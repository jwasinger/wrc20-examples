#! /bin/bash

set -e

cd ci 
geth_container=$(bash run.sh)
cd ..

sleep 40s
