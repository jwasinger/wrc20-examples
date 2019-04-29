.PHONY: all

all:
	clang -cc1 -Ofast -emit-llvm -triple=wasm32-unknown-unknown-wasm wrc20.c
	llc -O3 -filetype=obj wrc20.ll -o wrc20.o
	wasm-ld --no-entry wrc20.o -o wrc20.wasm --strip-all -allow-undefined-file=wrc20.syms -export=_main
	rm wrc20.ll wrc20.o

