#!/bin/bash

tag="s$(date +%s)"

# Minimal build steps:
make -C api build
make -C app build
make package/build

docker tag coldog/navigator:latest localhost:5000/navigator:$tag
docker push localhost:5000/navigator:$tag

kubectl --context minikube patch deployment navigator -p \
  '{"spec":{"template":{"spec":{"containers":[{"name":"navigator","image":"localhost:5000/navigator:'$tag'"}]}}}}'
