import { createLogic } from 'redux-logic';
import * as fetch from './fetch';

const q = 'API';

export const APPS_REQUEST = `${q}/APPS_REQUEST`;
export const APPS_SUCCESS = `${q}/APPS_SUCCESS`;
export const APPS_ABORTED = `${q}/APPS_ABORTED`;
export const APPS_FAILURE = `${q}/APPS_FAILURE`;

export const appsRequest = () => ({ type: APPS_REQUEST });
export const appsSuccess = apps => ({ type: APPS_SUCCESS, apps });
export const appsAborted = () => ({ type: APPS_ABORTED });
export const appsFailure = error => ({ type: APPS_FAILURE, error });

export const appsLogic = createLogic({
  type: APPS_REQUEST,
  cancelType: APPS_ABORTED,
  latest: true,

  async process(_, dispatch, done) {
    try {
      const res = await fetch.get('/api/v1/apps');
      dispatch(appsSuccess(fetch.toMap(res, 'name', { loaded: false })));
    } catch (e) {
      console.error(e);
      dispatch(appsFailure(e));
    }
    done();
  },
});

export const APP_REQUEST = `${q}/APP_REQUEST`;
export const APP_SUCCESS = `${q}/APP_SUCCESS`;
export const APP_ABORTED = `${q}/APP_ABORTED`;
export const APP_FAILURE = `${q}/APP_FAILURE`;

export const appRequest = id => ({ type: APP_REQUEST, id });
export const appSuccess = app => ({ type: APP_SUCCESS, app });
export const appAborted = () => ({ type: APP_ABORTED });
export const appFailure = error => ({ type: APP_FAILURE, error });

export const appLogic = createLogic({
  type: APP_REQUEST,
  cancelType: APP_ABORTED,
  latest: true,

  async process({ action }, dispatch, done) {
    try {
      const res = await fetch.get(`/api/v1/apps/${action.id}`);
      dispatch(appSuccess(res));
    } catch (e) {
      console.error(e);
      dispatch(appFailure(e));
    }
    done();
  },
});

export const APP_RELEASE_REQUEST = `${q}/APP_RELEASE_REQUEST`;
export const APP_RELEASE_SUCCESS = `${q}/APP_RELEASE_SUCCESS`;
export const APP_RELEASE_ABORTED = `${q}/APP_RELEASE_ABORTED`;
export const APP_RELEASE_FAILURE = `${q}/APP_RELEASE_FAILURE`;

export const appReleaseRequest = (app, stage, version) => ({
  type: APP_RELEASE_REQUEST,
  app,
  stage,
  version,
});
export const appReleaseSuccess = () => ({ type: APP_RELEASE_SUCCESS });
export const appReleaseAborted = () => ({ type: APP_RELEASE_ABORTED });
export const appReleaseFailure = error => ({
  type: APP_RELEASE_FAILURE,
  error,
});

export const appReleaseLogic = createLogic({
  type: APP_RELEASE_REQUEST,
  cancelType: APP_RELEASE_ABORTED,
  latest: true,

  async process({ action }, dispatch, done) {
    try {
      const url = `/api/v1/apps/${action.app}/${action.stage}/release?version=${
        action.version
      }`;
      await fetch.post(url);
      dispatch(appReleaseSuccess());
      dispatch(appRequest(action.app));
    } catch (e) {
      console.error(e);
      dispatch(appReleaseFailure(e));
    }
    done();
  },
});

export const APP_PROMOTE_REQUEST = `${q}/APP_PROMOTE_REQUEST`;
export const APP_PROMOTE_SUCCESS = `${q}/APP_PROMOTE_SUCCESS`;
export const APP_PROMOTE_ABORTED = `${q}/APP_PROMOTE_ABORTED`;
export const APP_PROMOTE_FAILURE = `${q}/APP_PROMOTE_FAILURE`;

export const appPromoteRequest = (app, stage, version, to) => ({
  type: APP_PROMOTE_REQUEST,
  app,
  stage,
  version,
  to,
});
export const appPromoteSuccess = () => ({ type: APP_PROMOTE_SUCCESS });
export const appPromoteAborted = () => ({ type: APP_PROMOTE_ABORTED });
export const appPromoteFailure = error => ({
  type: APP_PROMOTE_FAILURE,
  error,
});

export const appPromoteLogic = createLogic({
  type: APP_PROMOTE_REQUEST,
  cancelType: APP_PROMOTE_ABORTED,
  latest: true,

  async process({ action }, dispatch, done) {
    try {
      const url = `/api/v1/apps/${action.app}/${action.stage}/promote?version=${
        action.version
      }&to=${action.to}`;
      await fetch.post(url);
      dispatch(appPromoteSuccess());
      dispatch(appRequest(action.app));
    } catch (e) {
      console.error(e);
      dispatch(appPromoteFailure(e));
    }
    done();
  },
});

export const APP_REMOVE_REQUEST = `${q}/APP_REMOVE_REQUEST`;
export const APP_REMOVE_SUCCESS = `${q}/APP_REMOVE_SUCCESS`;
export const APP_REMOVE_ABORTED = `${q}/APP_REMOVE_ABORTED`;
export const APP_REMOVE_FAILURE = `${q}/APP_REMOVE_FAILURE`;

export const appRemoveRequest = (app, stage, version, to) => ({
  type: APP_REMOVE_REQUEST,
  app,
  stage,
  version,
});
export const appRemoveSuccess = () => ({ type: APP_REMOVE_SUCCESS });
export const appRemoveAborted = () => ({ type: APP_REMOVE_ABORTED });
export const appRemoveFailure = error => ({
  type: APP_REMOVE_FAILURE,
  error,
});

export const appRemoveLogic = createLogic({
  type: APP_REMOVE_REQUEST,
  cancelType: APP_REMOVE_ABORTED,
  latest: true,

  async process({ action }, dispatch, done) {
    try {
      const url = `/api/v1/apps/${action.app}/${action.stage}/release?version=${
        action.version
      }`;
      await fetch.destroy(url);
      dispatch(appRemoveSuccess());
      dispatch(appRequest(action.app));
    } catch (e) {
      console.error(e);
      dispatch(appRemoveFailure(e));
    }
    done();
  },
});

export const APP_SAVE_REQUEST = `${q}/APP_SAVE_REQUEST`;
export const APP_SAVE_SUCCESS = `${q}/APP_SAVE_SUCCESS`;
export const APP_SAVE_ABORTED = `${q}/APP_SAVE_ABORTED`;
export const APP_SAVE_FAILURE = `${q}/APP_SAVE_FAILURE`;

export const appSaveRequest = app => ({
  type: APP_SAVE_REQUEST,
  app,
});
export const appSaveSuccess = () => ({ type: APP_SAVE_SUCCESS });
export const appSaveAborted = () => ({ type: APP_SAVE_ABORTED });
export const appSaveFailure = error => ({
  type: APP_SAVE_FAILURE,
  error,
});

export const appSaveLogic = createLogic({
  type: APP_SAVE_REQUEST,
  cancelType: APP_SAVE_ABORTED,
  latest: true,

  async process({ action }, dispatch, done) {
    try {
      const url = `/api/v1/apps`;
      await fetch.post(url, action.app);
      dispatch(appSaveSuccess());
      dispatch(appRequest(action.app.name));
    } catch (e) {
      console.error(e);
      dispatch(appSaveFailure(e));
    }
    done();
  },
});

export const reducer = (state = { data: {}, notifications: [] }, action) => {
  switch (action.type) {
    // APP
    case APP_REQUEST:
      return state;
    case APP_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          [action.app.name]: {
            ...action.app,
            loaded: true,
          },
        },
      };
    case APP_ABORTED:
      return { ...state, error: 'ABORTED' };
    case APP_FAILURE:
      return { ...state, error: action.error };

    // APPS
    case APPS_REQUEST:
      return state;
    case APPS_SUCCESS:
      return { ...state, data: action.apps };
    case APPS_ABORTED:
      return { ...state, error: 'ABORTED' };
    case APPS_FAILURE:
      return { ...state, error: action.error };

    // APP_RELEASE
    case APP_RELEASE_ABORTED:
      return { ...state, error: 'ABORTED' };
    case APP_RELEASE_FAILURE:
      return { ...state, error: action.error };

    // APP_PROMOTE
    case APP_PROMOTE_ABORTED:
      return { ...state, error: 'ABORTED' };
    case APP_PROMOTE_FAILURE:
      return { ...state, error: action.error };

    // APP_REMOVE
    case APP_REMOVE_ABORTED:
      return { ...state, error: 'ABORTED' };
    case APP_REMOVE_FAILURE:
      return { ...state, error: action.error };

    // APP_SAVE
    case APP_SAVE_ABORTED:
      return { ...state, error: 'ABORTED' };
    case APP_SAVE_FAILURE:
      return { ...state, error: action.error };

    default:
      return state;
  }
};

export const logic = [
  appsLogic,
  appLogic,
  appReleaseLogic,
  appPromoteLogic,
  appRemoveLogic,
  appSaveLogic,
];
