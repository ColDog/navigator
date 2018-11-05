import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import BuildCard from './BuildCard';
import get from 'lodash/get';

export default ({ stages, callbacks }) => (
  <Grid columns={stages.length} stackable>
    {stages.map((stage, idx) => (
      <Grid.Column key={stage.id}>
        <Header>{stage.name}</Header>

        {stage.review &&
          stage.builds
            .filter(build => !build.removed)
            .map(build => (
              <BuildCard
                key={build.id}
                build={build}
                stage={stage}
                undeployed={false}
                nextStage={stages[idx + 1]}
                {...callbacks}
              />
            ))}

        {!stage.review &&
          get(stage, 'current.id') !== get(stage, 'released.id') && (
            <BuildCard
              build={stage.current}
              stage={stage}
              undeployed={true}
              nextStage={stages[idx + 1]}
              {...callbacks}
            />
          )}

        {!stage.review &&
          stage.released &&
          stage.released.release.clusters.length > 0 &&
          stage.released.release.clusters.map(cluster => (
            <BuildCard
              key={cluster.id}
              build={stage.released}
              stage={stage}
              cluster={cluster.name}
              undeployed={false}
              nextStage={stages[idx + 1]}
              {...callbacks}
            />
          ))}

        {!stage.review &&
          stage.released &&
          stage.released.release.clusters.length === 0 && (
            <BuildCard
              build={stage.released}
              stage={stage}
              undeployed={false}
              nextStage={stages[idx + 1]}
              {...callbacks}
            />
          )}
      </Grid.Column>
    ))}
  </Grid>
);
