for wasm in build/wasm/*; do 
  for tmpl in templates/*; do
    testname="$(echo $(basename $tmpl) | sed 's/\.yml//g')$(echo $(basename $wasm) | sed 's/\.wasm//g')"
    wasm_hex="$(cat $wasm | xxd -p -c 100000)"
    sed "s/{TEST_NAME}/$testname/g" $tmpl | sed "s/{WRC20_CODE}/$wasm_hex/g" > build/tests/src/GeneralStateTestsFiller/stEWASMTests/$testname.yml
    echo $testname >> build/test_list.txt
  done
done
