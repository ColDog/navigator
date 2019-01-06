#!/bin/bash

tag="s$(date +%s)"

# Minimal build steps:
make -C api build
make -C app build
make package/build

docker tag coldog/navigator:latest localhost:5000/navigator:$tag
docker push localhost:5000/navigator:$tag

helm template \
  --name navigator \
  --set image.repository=localhost:5000/navigator \
  --set image.tag=$tag \
  --set service.type=NodePort \
  ./charts/navigator |
  kubectl --context minikube apply -f -
