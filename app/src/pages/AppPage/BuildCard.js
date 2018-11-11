import React from 'react';
import { Card, Button, Icon } from 'semantic-ui-react';
import get from 'lodash/get';

export default ({
  stage,
  app,
  build,
  undeployed,
  nextStage,
  cluster,
  onPromote,
  onRemove,
  onRelease,
}) => (
  <Card>
    <Card.Content>
      <Card.Header>
        <code>{build.version}</code>
      </Card.Header>
      {cluster && (
        <Card.Meta>
          {cluster.name} - {cluster.status || build.status}
        </Card.Meta>
      )}
    </Card.Content>
    <Card.Content extra>
      {stage.review && build.released && (
        <Button
          onClick={() => onRemove(app.name, stage.name, build.version)}
          basic={true}
          color="red"
        >
          Close
        </Button>
      )}

      {stage.review && !build.released && (
        <Button
          onClick={() => onRelease(app.name, stage.name, build.version)}
          basic={true}
          color="green"
        >
          Review
        </Button>
      )}

      {!stage.review &&
        build.released &&
        stage.previous &&
        build.id === get(stage, 'released.id') && (
          <Button
            onClick={() =>
              onRelease(app.name, stage.name, get(stage, 'previous.version'))
            }
            basic={true}
            color="red"
          >
            Rollback
          </Button>
        )}

      {stage.promotion &&
        nextStage &&
        !build.promoted &&
        !undeployed &&
        build.id === get(stage, 'released.id') && (
          <Button
            onClick={() =>
              onPromote(app.name, stage.name, build.version, nextStage.name)
            }
            basic={true}
            color="green"
          >
            Promote
          </Button>
        )}

      {undeployed && (
        <Button
          onClick={() => onRelease(app.name, stage.name, build.version)}
          basic={true}
          color="green"
        >
          Deploy
        </Button>
      )}
    </Card.Content>
    {build.released && (
      <Card.Content extra>
        <a href={`/logs/${build.release.id}`}>
          <Icon name="terminal" />
        </a>
      </Card.Content>
    )}
  </Card>
);
