#!/bin/bash

commit=$(git rev-parse --short HEAD)

docker build -t coldog/nginx:$commit .
docker push coldog/nginx:$commit

navctl apply ./app.json

navctl build \
  -a test \
  -s staging \
  -v $commit
