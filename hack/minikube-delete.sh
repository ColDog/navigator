#!/bin/bash

helm template \
  --name navigator \
  ./charts/navigator |
  kubectl --context minikube delete -f -
