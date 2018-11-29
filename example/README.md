# Example App

This is an example app that releases an Nginx image to a Kubernetes cluster
using helm.

## CI/CD

Overview of a typical CI/CD workflow.

### Branch

We execute the following script to push a review build into navigator. This will
trigger a review version of the app in a namespace designated for the given
branch.

```bash
# ci/branch.sh

commit=$(git rev-parse --short HEAD)
branch=$(git rev-parse --abbrev-ref HEAD)

docker build -t coldog/nginx:$commit .
docker push coldog/nginx:$commit

navctl build \
  -a example \
  -n ${branch} \
  -s review \
  -v ${commit}
```
### Master

We execute the following script to push a staging build into navigator. This
will trigger a staging release automatically. We can then, in the console,
promoote the build to production when we have confirmed it on staging.

Note, we also apply the app manifest at this stage as well, this allows us to
make sure our app manifest is stored in git but applied when it's changed.

```bash
# ci/master.sh

commit=$(git rev-parse --short HEAD)

docker build -t coldog/nginx:$commit .
docker push coldog/nginx:$commit

navctl apply ./app.json

navctl build \
  -a example \
  -s staging \
  -v $commit

```
