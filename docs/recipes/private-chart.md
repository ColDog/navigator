# Recipe - Private Chart

Releasing using a chart stored in a private repository. Let's say I have a repo
on github called `github.com/example/charts` with a chart in the folder
`mychart`. When I release we want to pull this chart and apply it to the
cluster.

On GitHub create a "machines" or "robot" user that will fetch from repositories
on your behalf. This is just a user in your GitHub organization that is used on
CI services.

Once in this account, create a personal access token in this robot user account.

Finally, on the navigator server set the `gitCredentials` helm chart value equal
to:

    https://{bot-username}:{access-token}.github.com

This value will be placed in the `.git-credentials` file on the container and
will be used by git when fetching remote urls.

Now, when creating out build we can specify a chart URL:

    navctl build \
      --app test \
      --stage staging \
      --version $GIT_COMMIT \
      --chart github.com/example/charts//mychart?ref=$GIT_COMMIT
