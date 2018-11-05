import React from 'react'
import { Form, Button, TextArea } from 'semantic-ui-react'

export default ({ onSave, onChange, value, manifest }) => (
  <Form onSubmit={onSave}>
    <Form.Field>
      <TextArea
        style={{ fontFamily: 'monospace' }}
        rows={45}
        onChange={onChange}
        value={value || JSON.stringify(manifest, null, 2)}
      />
    </Form.Field>
    <Button primary disabled={!value}>
      Save
    </Button>
  </Form>
);
