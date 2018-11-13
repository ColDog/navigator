#!/bin/bash

commit=$(git rev-parse --short HEAD)
branch=$(git rev-parse --abbrev-ref HEAD)

docker build -t coldog/nginx:$commit .
docker push coldog/nginx:$commit

navctl build \
  -a test \
  -n $branch \
  -s staging \
  -v $commit
