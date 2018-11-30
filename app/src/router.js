import React from "react";
import page from "page";
import { connect } from "react-redux";

const NAVIGATE = "ROUTER/NAVIGATE";

const navigate = (route, params) => ({ type: NAVIGATE, route, params });

const routes = {};

export const route = (path, Component) => {
  routes[path] = store => ctx => store.dispatch(navigate(path, ctx.params));

  const Wrapper = props => {
    if (path === props.router.route) {
      return <Component {...props} />;
    }
    return null;
  };
  return connect(state => ({ router: state.router }))(Wrapper);
};

export const reducer = (state = { route: null, params: {} }, action) => {
  switch (action.type) {
    case NAVIGATE:
      return { ...state, params: action.params, route: action.route };
    default:
      return state;
  }
};

export const start = store => {
  for (let key in routes) {
    page(key, routes[key](store));
  }
  page.start();
};
