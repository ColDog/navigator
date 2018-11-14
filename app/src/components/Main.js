import React from 'react';
import Notify from './Notify';

export default ({ children }) => (
  <main style={{ paddingTop: 40 }}>
    {children}
    <Notify />
  </main>
);
