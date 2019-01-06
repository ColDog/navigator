#!/bin/bash

port=$(kubectl get svc/navigator -o json | jq '.spec.ports[0].nodePort')
key=$(kubectl get secrets/navigator-creds -o json | jq -r '.data.apiKey' | base64 --decode)
password=$(kubectl get secrets/navigator-creds -o json | jq -r '.data.basicPassword' | base64 --decode)

echo export BASIC_AUTH=$password
echo export API_KEY=$key
echo export API_URL=http://$(minikube ip):$port
