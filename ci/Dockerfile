FROM ethereum/cpp-build-env

COPY install_cmake.sh /

RUN bash /install_cmake.sh

ENV PATH="/root/.local/bin:${PATH}"

USER root

RUN curl https://dl.google.com/go/go1.12.5.linux-amd64.tar.gz > go.tar.gz \
	&& tar -C /usr/local -xvf go.tar.gz

USER builder

ENV PATH="/usr/local/go/bin:${PATH}"

RUN git clone https://github.com/ewasm/hera \
	&& cd hera \
	&& git submodule update --init \
	&& mkdir build \
	&& cd build \
	&& cmake -DBUILD_SHARED_LIBS=ON -DHERA_DEBUGGING=ON .. \
	&& make -j2 \
	&& cd ../.. \
	&& git clone https://github.com/ewasm/go-ethereum \
	&& cd go-ethereum \
	&& make -j2 \
	&& cd .. \
	&& cp go-ethereum/build/bin/geth . \
	&& cp hera/build/src/libhera.so . \
	&& rm -rf go-ethereum hera

ENTRYPOINT ["/home/builder/geth"]
