# Navigator Server

Navigator API server.

## Server Configuration

The server is configured with environment variables.

- `PORT`: Port configures the port for the main application (default `4000`).

### Repo Credentials

Configure credentials for chart repository access.

- `GIT_CREDENTIALS`: Writes credentials to `.git-credentials` that can be used
  for fetching charts from private repositories over HTTPS.

### Kubernetes

Configure access to Kubernetes clusters:

- `KUBECONFIG`: Used by kubectl to find the kubeconfig files.
- `DEFAULT_SERVICE_ACCOUNT`: Name the current cluster default and allow
  deployments to this cluster (default: `false`).

Kubeconfig files: TODO

### Database

Configure the SQL database to connect to. Supports

- `DATABASE_DRIVER`: Driver name one of (`sqlite3`, `pg`, `mysql`).
- `DATABASE_NAME`: Database name to connect to.
- `DATABASE_USER`: Database username to connect to.
- `DATABASE_HOST`: Database host to connect to.
- `DATABASE_PASSWORD`: Database password.

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
