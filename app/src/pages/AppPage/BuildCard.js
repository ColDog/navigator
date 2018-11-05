import React from 'react';
import { Card, Button } from 'semantic-ui-react';
import get from 'lodash/get';

export default ({
  stage,
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
        <code>
          {build.version}-{build.number}
        </code>
      </Card.Header>
      <Card.Meta>{cluster}</Card.Meta>
      <Card.Description>{get(build, 'release.status')}</Card.Description>
    </Card.Content>
    <Card.Content extra>
      {stage.review &&
        build.released && (
          <Button
            onClick={() => onRemove(build.app.name, stage.name, build.version)}
            basic={true}
            color="red"
          >
            Close
          </Button>
        )}

      {stage.review &&
        !build.released && (
          <Button
            onClick={() => onRelease(build.app.name, stage.name, build.version)}
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
            onClick={() => onRelease(build.app.name, stage.name, get(stage, 'previous.version'))}
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
            onClick={() => onPromote(build.app.name, stage.name, build.version, nextStage.name)}
            basic={true}
            color="green"
          >
            Promote
          </Button>
        )}

      {undeployed && (
        <Button
          onClick={() => onRelease(build.app.name, stage.name, build.version)}
          basic={true}
          color="green"
        >
          Deploy
        </Button>
      )}
    </Card.Content>
  </Card>
);
