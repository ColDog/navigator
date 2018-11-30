import React from "react";
import ReactDOM from "react-dom";
import store from "./store";
import * as router from "./router";
import App from "./App";

import "semantic-ui-css/semantic.min.css";

ReactDOM.render(<App />, document.getElementById("root"));

router.start(store);
