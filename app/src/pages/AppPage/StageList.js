import React from 'react';
import { Grid, Header, Button } from 'semantic-ui-react';
import BuildCard from './BuildCard';
import BuildsModal from './BuildsModal';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import words from 'lodash/words';

export default class StageList extends React.Component {
  state = { deployModal: null };

  setDeployModal = deployModal => {
    this.setState({ deployModal });
  };

  render() {
    const { app, stages, callbacks } = this.props;
    const { deployModal } = this.state;

    return (
      <Grid columns={stages.length} stackable>
        {stages.map((stage, idx) => (
          <Grid.Column key={stage.name}>
            <Header>
              <Button
                onClick={() => this.setDeployModal(stage.name)}
                basic
                size="tiny"
                floated="right"
              >
                Builds
              </Button>
              {capitalize(words(stage.name).join(' '))}
            </Header>

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
              get(stage, 'current.version') !==
                get(stage, 'released.version') && (
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
                  canary={stage.released.canary}
                  stage={stage}
                  cluster={cluster}
                  app={app}
                  undeployed={false}
                  nextStage={stages[idx + 1]}
                  {...callbacks}
                />
              ))}

            <BuildsModal
              onRollback={callbacks.onRelease}
              open={deployModal === stage.name}
              onClose={() => this.setDeployModal()}
              name={capitalize(words(stage.name).join(' '))}
              builds={stage.builds}
            />
          </Grid.Column>
        ))}
      </Grid>
    );
  }
}
