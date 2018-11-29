# Helm Deploy

The helm deploy collects and renders your helm chart and then applies or deletes
the manifests using kubectl delete. This way, tiller does not need to run with
superuser priviledges inside the cluster. It does mean that you will lose the
advantages of helm rollback commands.

```bash
Usage: helm-deploy (apply|delete) [options] name chart

Options:
  -h, --help            show this help message and exit
  -c CONTEXT, --context=CONTEXT
                        Kubernetes context
  -u AS_USER, --as=AS_USER
                        Kubernetes user
  -g AS_GROUP, --as-group=AS_GROUP
                        Kubernetes user
  -n NAMESPACE, --namespace=NAMESPACE
                        Kubernetes namespace
  -f VALUES, --values=VALUES
                        Helm chart value file
```

## Tasks (`helm-deploy.k8s.io/task`)

If a Pod is annotated with `helm-deploy.k8s.io/task` then it will be executed
before the rest of the deployment is rolled out.

- The task logs will be streamed to the console.
- The task will fail the release if it fails to execute.

## Istio (`helm-deploy.k8s.io/istio`)

If a manifest is annotated with `helm-deploy.k8s.io/istio` then it will run
the istio inject on this manifest.

## Deployments

Helm deploy will wait for deployments to rollout using `kubectl rollout status`.
This means that the deploy script will fail if the deployment reaches the
maximum allowed time.
