import React from "react";
import { Breadcrumb } from "semantic-ui-react";

const styles = {
  container: { padding: 15, backgroundColor: "#eee", width: "100%" },
};

export default ({ children }) => (
  <Breadcrumb style={styles.container}>{children}</Breadcrumb>
);

export const Divider = Breadcrumb.Divider;
export const Section = Breadcrumb.Section;
