# Navigator Chart

Navigator helm chart: Launches the navigator service on a Kubernetes cluster.

## Installation

Install the helm cli tool if you already haven't.

    curl https://raw.githubusercontent.com/helm/helm/master/scripts/get | bash

First create a secret outside of helm which will serve as the database password.

    kubectl create secret generic navigator-db \
      --from-literal=postgresql-password=$(date | md5sum | awk '{print $1}' | base64)

Now we can install the navigator helm chart. Note, the default service
configuration for the navigator server is to provision a load balancer.

    version=$(curl https://raw.githubusercontent.com/ColDog/navigator/master/version)
    helm install https://github.com/ColDog/navigator/releases/download/${version}/navigator-${version}.tgz

You should be able to follow the instructions from the helm output on how to
reach the navigator server, once you have access to this you can load it up in
your browser. The default configuration is insecure and will allow all users
access.

## Configuration

Parameter | Description | Default
--------- | ----------- | -------
`replicaCount` | API count of replicas | `1` |
`ingress.enabled` | Enables Ingress  | `false`
`ingress.annotations` | Ingress annotations | `{}`
`ingress.path` | Ingress path | `/`
`ingress.hosts` | Ingress hosts | `[]`
`ingress.tls` | Ingress tls configuration | `[]`
`image.repository` | Image repository | `coldog/navigator`
`image.tag` | Image tag | `8.1.1`
`image.pullPolicy` | Image pullPolicy | `IfNotPresent`
`service.port` | Service port | `80`
`service.type` | Service type | `LoadBalancer`
`resources` | Chart resources block | `{}`
`nodeSelector` | Node selector | `{}`
`tolerations` | Node tolerations | `[]`
`affinity` | Node affinity |  `{}`
`kubeconfig` | Kubeconfig files base64 encoded as a map | `{}`
`defaultServiceAccount` | Use the service account applied to the pod | `{}`
`gitCredentials` | Credentials for pulling from private git repos | `""`
`db.secret` | Database secret resource with password | `navigator-db`
`db.driver` | Database driver name | `postgresql`
`db.host` | Database driver name | `navigator-postgresql`
`db.user` | Database username | `navigator`
`auth.disabled` | Disable authentication | `true`
`auth.proxy.enabled` | Enable proxy authentication | `false`
`auth.proxy.header` | Proxy authentication user header | `x-forwarded-user`
`auth.api.enabled` | Enable api authentication | `false`
`auth.api.key` | Api key | `""`
`auth.jwt.enabled` | Enable JWT authentication | `false`
`auth.jwt.key` | JWT secret | `""`
`postgresql.existingSecret` | Postgres chart secret resource | `navigator-db`
`postgresql.postgresqlUsername` | Postgres chart username | `navigator`
`postgresql.postgresqlDatabase` | Postgres chart username | `navigator`
