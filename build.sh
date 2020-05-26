#!/bin/bash

set -e

VERSION=`yarn -s echo-version`

docker build -f ./docker/Dockerfile -t elrohil/fogdevice-supervisor-api:latest -t elrohil/fogdevice-supervisor-api:${VERSION} ./
