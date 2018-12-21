# Recipe - External Deployment

Let's say you have a complex deployment pipeline or job that you want to trigger
with navigator. Simply build a basic deployment script with the parameters that
you need, an example which parses the arguments is listed below:

```bash
#!/bin/bash

chart=""
release=""
cluster=""
stage=""
app=""
version=""
values=""
namespace=""
command="apply"

while getopts ":r:c:s:a:v:q:g:u:n:b:d:" opt; do
  case ${opt} in
    r ) release=$OPTARG ;;
    c ) cluster=$OPTARG ;;
    s ) stage=$OPTARG ;;
    a ) app=$OPTARG ;;
    v ) version=$OPTARG ;;
    q ) values=$OPTARG ;;
    n ) namespace=$OPTARG ;;
    b ) chart=$OPTARG ;;
    d ) command="delete" ;;
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

# Trigger my deployment.
```

Now edit the final parts of the script to kick off your deployment job and you
are all set!
