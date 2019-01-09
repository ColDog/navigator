# Recipe - Canaries

A canary deployment, if specified in the UI will pass the following values along
to the helm chart:

```javascript
{
  "canary": {
    "enabled": true,
    "tag": "new-canary-docker-tag",
    "weight": 50
  }
  ...
}
```

The helm chart can use this to create an optional canary deployment resource
that will receive the configured weight of traffic. The `./charts/service` has
a helm chart that does this.
