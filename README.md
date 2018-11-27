# Navigator

TOC

## Getting Started

## Installation

### Local Installation

Run the navigator server locally on port 4000.

```bash
docker run \
  -e AUTH_DISABLED=true \
  -p 4000:4000 \
  --rm -it \
  coldog/navigator:latest
```

### Kubernetes Installation

TODO

## Server Configuration

The server is configured with environment variables.

- `PORT`: Port configures the port for the main application (default `4000`).

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

[JSON Schema](./schema/app.json)

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

## Deploy Scripts

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

## API

## CLI
