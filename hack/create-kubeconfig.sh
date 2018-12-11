#!/bin/bash
# Create a kubeconfig file with a service account named navigator.

NAME="${1:-staging}"
echo "Name:       ${NAME}"

CONFIG="${2:-kubeconfig}"
echo "Kubeconfig: ${CONFIG}"

NAMESPACE="${3:-kube-system}"
echo "Namespace:  ${NAMESPACE}"

CONTEXT=$(kubectl config current-context)
echo "Context:    ${CONTEXT}"

CLUSTER=$(kubectl config get-contexts "$CONTEXT" | awk '{print $3}' | tail -n 1)
echo "Cluster:    ${CLUSTER}"

ENDPOINT=$(kubectl config view -o jsonpath="{.clusters[?(@.name == \"${CLUSTER}\")].cluster.server}")
echo "Endpoint:   ${ENDPOINT#*//}"

echo ""

echo "Creating service account..."
kubectl -n $NAMESPACE create serviceaccount navigator

echo "Creating cluster role binding..."
kubectl -n $NAMESPACE create clusterrolebinding navigator \
  --clusterrole=cluster-admin \
  --serviceaccount=${NAMESPACE}:navigator

echo "Getting service account secret..."
SECRET=$(kubectl -n $NAMESPACE get sa/navigator -o json | jq -r '.secrets[0].name')

echo "Getting ca..."
CA=$(kubectl get secret -n $NAMESPACE $SECRET -o json | jq -r '.data["ca.crt"]')

echo "Getting token..."
TOKEN=$(kubectl get secret -n $NAMESPACE $SECRET -o json | jq -r '.data["token"]' | base64 --decode)

echo "Writing kubeconfig to $CONFIG..."
cat > $CONFIG <<EOF
apiVersion: v1
kind: Config
current-context: ${NAME}
clusters:
- name: ${NAME}
  cluster:
    server: ${ENDPOINT}
    certificate-authority-data: ${CA}
users:
- name: ${NAME}
  user:
    token: ${TOKEN}
contexts:
- name: ${NAME}
  context:
    cluster: ${NAME}
    user: ${NAME}
EOF
