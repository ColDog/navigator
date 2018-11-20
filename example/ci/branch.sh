#!/bin/bash

commit=$(git rev-parse --short HEAD)
branch=$(git rev-parse --abbrev-ref HEAD)

# docker build -t coldog/nginx:$commit .
# docker push coldog/nginx:$commit

navctl build \
  -a example \
  -n pr1234 \
  -s review \
  -v ${commit}3
