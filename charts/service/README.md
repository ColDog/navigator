# Service

A generic service helm chart that provides an abstraction over some of the more
complex Kubernetes and istio configurations.

## Configuration

Parameter | Description | Default
--------- | ----------- | -------
`replicaCount` | API count of replicas | `1` |
`image.repository` | Image repository | `nginx`
`image.tag` | Image tag | `8.1.1`
`image.pullPolicy` | Image pullPolicy | `IfNotPresent`
`istio` | Enable istio | `false`
`canary.enabled` | Enable canary deployment | `false`
`canary.tag` | Image tag for canary deployment | `null`
`canary.weight` | Weight for the canary deployment | `10`
`service.port` | Service port | `80`
`service.path` | Service path (if istio enabled) | `/`
`service.hosts` | Service host list (if istio enabled) | `[]`
`service.gateways` | Istio gateways | `[]`
`resources` | Chart resources block | `{}`
`nodeSelector` | Node selector | `{}`
`tolerations` | Node tolerations | `[]`
`affinity` | Node affinity |  `{}`
`trafficPolicy` | Istio traffic policies https://istio.io/docs/reference/config/istio.networking.v1alpha3/#TrafficPolicy | `{}`
`trafficPolicy` | Istio route settings https://istio.io/docs/reference/config/istio.networking.v1alpha3/#HTTPRoute | `{}`
