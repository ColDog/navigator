import React from "react";
import { Modal, List, Button } from "semantic-ui-react";
import moment from "moment";

export default ({ onClose, onRollback, open, name, builds }) => (
  <Modal size="small" open={open} onClose={onClose}>
    <Modal.Header>{name} Builds</Modal.Header>
    <Modal.Content>
      <List divided ordered>
        {builds.map(build => (
          <List.Item>
            <List.Content floated="right">
              <Button
                size="tiny"
                basic
                secondary
                onClick={() => {
                  onRollback(build.app, build.stage, build.version);
                  onClose();
                }}
              >
                Rollback
              </Button>
            </List.Content>
            <List.Content>
              <List.Header>
                <code>{build.version}</code>
              </List.Header>
              {moment(build.created).fromNow()}
            </List.Content>
          </List.Item>
        ))}
      </List>
    </Modal.Content>
  </Modal>
);
