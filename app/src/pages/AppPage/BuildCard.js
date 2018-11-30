import React from "react";
import { Card, Button, Icon } from "semantic-ui-react";
import get from "lodash/get";
import moment from "moment";

const color = (build, canary, undeployed) => {
  if (undeployed) {
    return "grey";
  }
  if (canary) {
    return "yellow";
  }
  switch (build.status) {
    case "ERRORED":
      return "red";
    case "SUCCESS":
      return "green";
    default:
      return null;
  }
};

export default class BuildCard extends React.PureComponent {
  render() {
    const {
      stage,
      app,
      build,
      undeployed,
      nextStage,
      cluster,
      canary,
      onPromote,
      onRemove,
      onRelease,
    } = this.props;
    return (
      <Card fluid color={color(build, canary, undeployed)}>
        <Card.Content>
          <Card.Header>
            {build.released && !undeployed ? (
              <a href={`/logs/${build.releaseId}`}>
                <code>{canary ? canary.version : build.version}</code>
              </a>
            ) : (
              <code>{build.version}</code>
            )}
            {build.namespace && ` ${build.namespace}`}
          </Card.Header>
          <Card.Meta>{moment(build.created).fromNow()}</Card.Meta>
          {!undeployed && (
            <Card.Description>
              {cluster && `Cluster: ${cluster.name}`}
              {cluster && build.status && <br />}
              {build.status && ` Release status: ${build.status}`}
            </Card.Description>
          )}
        </Card.Content>
        <Card.Content extra>
          {stage.review && build.released && (
            <Button
              onClick={() => onRemove(app.name, stage.name, build.version)}
              basic
              color="red"
            >
              Close
            </Button>
          )}

          {stage.review && !build.released && (
            <Button
              onClick={() => onRelease(app.name, stage.name, build.version)}
              basic
              color="green"
            >
              Review
            </Button>
          )}

          {stage.promote &&
            nextStage &&
            !undeployed &&
            build.version === get(stage, "released.version") && (
              <Button
                onClick={() =>
                  onPromote(app.name, stage.name, build.version, nextStage.name)
                }
                basic
                color="green"
              >
                Promote
              </Button>
            )}

          {!undeployed && (
            <Button
              onClick={() => onRelease(app.name, stage.name, build.version)}
              basic
            >
              Redeploy
            </Button>
          )}

          {undeployed && (
            <Button
              onClick={() => onRelease(app.name, stage.name, build.version)}
              basic
              color="green"
            >
              Deploy
            </Button>
          )}

          {undeployed && stage.released && (
            <Button
              onClick={() =>
                onRelease(app.name, stage.name, stage.released.version, {
                  version: build.version,
                  weight: 50,
                })
              }
              basic
            >
              Canary
            </Button>
          )}
        </Card.Content>
        {canary && (
          <Card.Content extra>
            <Icon name="earlybirds" />
            Canary release with weight of {canary.weight}
          </Card.Content>
        )}
      </Card>
    );
  }
}
