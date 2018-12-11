# Navigator

Pipeline based deployment management for Kubernetes and more.

![dashboard](docs/images/dashboard.png)

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Server Configuration](#server-configuration)
- [Application Configuration](#application-configuration)
- [Releases](#releases)
- [API](#api)
- [CLI](#cli)

<hr>

## Getting Started

Run navigator on port 4000 locally:

    docker run \
      -e AUTH_DISABLED=true \
      -p 4000:4000 \
      --rm -it \
      coldog/navigator:latest

Install the navctl CLI locally.

    curl https://raw.githubusercontent.com/ColDog/navigator/master/hack/install.sh | sudo bash

We need to setup an example application. Copy the configuration [here] to a
local file on disk. Now let's apply the configuration:

[here]: ../example/app.json

    navctl apply app.json

Once this is applied, you should be able to open up https://localhost:4000 and
see the `Example` app is ready. Now we can add a build to the review pipeline:

    navctl build -a example -n pr1234 -s review -v v1

If you open up the app again, you should see an application in the review stage.
We can also easily create a build in the staging stage like so:

    navctl build -a example -s staging -v v1

And with this build we can also try rolling this out to production if we want
to by promoting the build on staging. Note, nothing was actually deployed here
the script is using a mock deployment script which simply sleeps for a period
to emulate a deploy. This short guide has hopefully given you a short intro to
navigator.

To move this into your release workflow you can manage the releases through your
CI provider. The [example application](example) can provide a basic release
example for a CI workflow.

## Installation

### Local

Install the cli tool locally:

    curl https://raw.githubusercontent.com/ColDog/navigator/master/hack/install.sh | sudo bash

Run the navigator server locally on port 4000:

    docker run \
      -e AUTH_DISABLED=true \
      -p 4000:4000 \
      --rm -it \
      coldog/navigator:latest

### Kubernetes

Install the helm cli tool:

    curl https://raw.githubusercontent.com/helm/helm/master/scripts/get | bash

Install the cli tool locally:

    curl https://raw.githubusercontent.com/ColDog/navigator/master/hack/install.sh | sudo bash

Install the navigator server using helm. Note, the default service configuration
for the navigator server is to provision a load balancer. This will provision a
cloud load balancer and return you the IP.

    helm install https://github.com/ColDog/navigator/releases/download/v0.0.2/navigator-v0.0.2.tgz

You should be able to follow the instructions from the helm output on how to
reach the navigator server, once you have access to this you can load it up in
your browser. The default configuration is insecure and will allow all users
access.

## Server Configuration

The server is configured with environment variables.

- `PORT`: Port configures the port for the main application (default `4000`).

### Kubernetes

Configure access to Kubernetes clusters:

- `KUBECONFIG`: Used by kubectl to find the kubeconfig files.
- `DEFAULT_SERVICE_ACCOUNT`: Name the current cluster default and allow
  deployments to this cluster (default: `false`).

Kubeconfig files: TODO

### Database

Configure the SQL database to connect to. Supports

- `DATABASE_DRIVER`: Driver name one of (`sqlite3`, `pg`, `mysql`).
- `DATABASE_URL`: Connection string database url.

### Authentication

To disable auth set the following environment variable:

- `AUTH_DISABLED`: Allow all requests as authenticated (default: `false`).

#### Proxy Authentication

Proxy authentication assumes some proxy server is routing all traffic to the
application, the users email will be pulled out of the configured header.

__WARNING: When using proxy authentication ensure that the server is not exposed
as well without the proxy. It will allow users to write their own auth header.__

- `PROXY_AUTH`: Enable proxy authentication (default: `false`).
- `PROXY_AUTH_HEADER`: Set the email header (default: `x-forwarded-email`).

#### API Key Authentication

API key authentication validates against a single static api key. The api key
should be passed in the authorization header: `authorization: bearer <key>`.

- `API_AUTH`: Enable api key authentication. (default: `false`).
- `API_KEY`: API key to validate against (default: null).

#### JWT Authentication

JWT authentication validates against json web tokens. It will use the `email`
parameter inside the jwt to identify the user. The token should be passed in the
authorization header: `authorization: bearer <key>`.

- `JWT_AUTH`: Enable json web token authentication. (default: `false`).
- `JWT_SECRET`: JWT secret to validate keys against (default: null).

## Application Configuration

[JSON Schema](schema/app.json)

Example:

```javascript
{
  // Application name.
  "name": "example",
  "config": {
    // Deploy script to execute for the deployment, usually `nav-deploy`.
    "deploy": "nav-deploy-mock",
    // Chart url, uses go-getter syntax.
    "chart": "github.com/ColDog/navigator.git//charts/service"
  },
  // A stage represents often an environment or set of configuration in your
  // release pipeline, usually 'staging' and 'production' are stages.
  "stages": [
    {
      "name": "review",
      "review": true,     // Is this a review stage?
      "auto": true,       // Should we auto deploy builds?
      "promotion": true,  // Allows promotion to the next stage.
      "clusters": [
        {
          "name": "minikube",     // Cluster name.
          "namespace": "default", // Kubernetes namespace.
          "values": {             // Helm chart values.
            "image": {
              "repository": "coldog/nginx"
            }
          }
        }
      ]
    }
  ]
}
```

## Releases

Releases can be whatever fits into a script that can accept command line
arguments. By default, navigator comes with the ability to deploy to Kubernetes
using a custom built script for rendering helm charts and applying them to the
cluster.

### Values

The values that are passed to the release script are merged from the values set
at the cluster level inside the application manifest and the values set on the
command line for a specific build.

If you configure `config.values.image` in your application manifest, then
navigator will set the following values on every deploy:

```yaml
image:
  tag: ${version}
```

During canary releases the following values will be set. It is up to the release
helm chart to handle these values appropriately to configure a canary release.

```yaml
canary:
  enabled: true
  tag: ${canary,version}
  weight: ${canary.weight}
```

The default [service helm chart](charts/service) combines these features along
with support for istio if desired.

### Helm Releaser

Read more about the [default release script](deployer).

### Deploy Scripts

Deploy scripts execute a deploy and write logs to stdout from the deployment.
Command line flags are passed into the script

- `-r`: Release ID.
- `-b`: Chart url.
- `-c`: Cluster name.
- `-n`: Namespace name.
- `-s`: Stage name.
- `-a`: App name.
- `-v`: Version.
- `-q`: JSON encoded values.

The default deployment script will apply a chart into the cluster without
requiring helm to be installed instead it will render the templates into the
cluster.

### Charts

The default release chart is at [charts/service](charts/service).

### Checks

Checks can be submitted for a given release that will be displayed in the UI to
give information on a given release and how it's performing. These involve a
simple name and status subscribed to a check. No action is taken by default on
the check status, but rather, left up to other tools to take action on.

### Rollbacks

Rollback configuration allows for rolling back on failure of a release, if a
release fails to successfully roll out across any cluster, or if checks posted
for a given release are failing.

TODO: Add rollback configurations.

## API

The API is available at `/api/v1/` from where you are running it. See the main
authentication section for handling authentication.

Currently the endpoints are undocumented the CLI and application are the main
way to interact with the API.

## CLI

The CLI tool `navctl` is the main instrumentation point for inserting a build
into the pipeline. It has two commands `apply` and `build`. Read further in the
embedded CLI documentation for more information using `-h`.

```bash
NAME:
   navctl - A new cli application

USAGE:
   navctl [global options] command [command options] [arguments...]

VERSION:
   0.0.1

COMMANDS:
     apply    Apply an application manifest to the server.
     build    Create a build to deploy.
     help, h  Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --api-key value, -k value  navigator api key [$API_KEY]
   --api-url value, -u value  navigator api url (default: "http://localhost:4000") [$API_URL]
   --help, -h                 show help
   --version, -v              print the version
```

## Releasing

Releasing a new version:

1. CI must be green.
2. Update version:
  - [charts/navigator/Chart.yaml]([charts/navigator/Chart.yaml])
  - [charts/service/Chart.yaml]([charts/service/Chart.yaml])
  - [version]([version])
3. Run `make release` or `make prerelease`.
