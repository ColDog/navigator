#!/bin/bash

chart=""
release=""
cluster=""
stage=""
app=""
version=""
values=""
namespace=""

while getopts ":r:c:s:a:v:q:g:u:n:b:" opt; do
  case ${opt} in
    r ) release=$OPTARG ;;
    c ) cluster=$OPTARG ;;
    s ) stage=$OPTARG ;;
    a ) app=$OPTARG ;;
    v ) version=$OPTARG ;;
    q ) values=$OPTARG ;;
    n ) namespace=$OPTARG ;;
    b ) chart=$OPTARG ;;
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
echo "chart:     $chart"
echo "app:       $app"
echo "version:   $version"
echo "values:    $values"
echo "namespace: $namespace"
echo ""

values_file=$(mktemp)
echo $values > $values_file

cd ../deployer/helm-deploy

# Execute the helm deploy script.
PYTHONUNBUFFERED=1 python3.6 main.py apply \
  -c $cluster \
  -n $namespace \
  -f $values_file \
  $app \
  $chart
