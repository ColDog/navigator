#!/bin/bash

release=""
cluster=""
stage=""
app=""
version=""
values=""
namespace=""

while getopts ":r:c:s:a:v:q:g:u:n:" opt; do
  case ${opt} in
    r ) release=$OPTARG ;;
    c ) cluster=$OPTARG ;;
    s ) stage=$OPTARG ;;
    a ) app=$OPTARG ;;
    v ) version=$OPTARG ;;
    q ) values=$OPTARG ;;
    n ) namespace=$OPTARG ;;
    \? )
      echo "Invalid option: $OPTARG"
      exit 1
      ;;
    : )
      echo "Invalid option: $OPTARG requires an argument"
      exit 1
      ;;
  esac
done

echo ""
echo "==> deploy to $cluster starting"
echo "release:   $release"
echo "cluster:   $cluster"
echo "stage:     $stage"
echo "app:       $app"
echo "version:   $version"
echo "values:    $values"
echo "namespace: $namespace"
echo ""

values_file=$(mktemp)
echo $values > $values_file

pushd ../deployer/helm-deploy
  # Execute the helm deploy script.
  # python main.py -c $cluster -n $namespace -f $values_file
popd
