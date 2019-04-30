cat build/test_list.txt | while read line
do
    docker run -v $(pwd)/tests-repo:/tests -t jwasinger/testeth-hera /build/test/testeth -t GeneralStateTests/stEWASMTests -- --testpath /tests --vm /hera/build/src/libhera.so --singletest $line
done
