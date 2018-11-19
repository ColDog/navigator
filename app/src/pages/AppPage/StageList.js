import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import BuildCard from './BuildCard';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import words from 'lodash/words';

export default ({ app, stages, callbacks }) => (
  <Grid columns={stages.length} stackable>
    {stages.map((stage, idx) => (
      <Grid.Column key={stage.name}>
        <Header>{capitalize(words(stage.name).join(' '))}</Header>

        {stage.review &&
          stage.builds
            .filter(build => !build.removed)
            .map(build => (
              <BuildCard
                key={build.id}
                build={build}
                app={app}
                stage={stage}
                undeployed={false}
                nextStage={stages[idx + 1]}
                {...callbacks}
              />
            ))}

        {!stage.review &&
          get(stage, 'current.version') !== get(stage, 'released.version') && (
            <BuildCard
              build={stage.current}
              stage={stage}
              app={app}
              undeployed={true}
              nextStage={stages[idx + 1]}
              {...callbacks}
            />
          )}

        {!stage.review &&
          stage.released &&
          stage.clusters.map(cluster => (
            <BuildCard
              build={stage.released}
              stage={stage}
              cluster={cluster}
              app={app}
              undeployed={false}
              nextStage={stages[idx + 1]}
              {...callbacks}
            />
          ))}

        {!stage.review &&
          stage.released &&
          stage.released.canary &&
          stage.clusters.map(cluster => (
            <BuildCard
              build={stage.released}
              stage={stage}
              cluster={cluster}
              app={app}
              undeployed={false}
              nextStage={stages[idx + 1]}
              {...callbacks}
            />
          ))}
      </Grid.Column>
    ))}
  </Grid>
);
