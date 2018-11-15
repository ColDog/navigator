import { createLogic } from 'redux-logic';
import * as fetch from './fetch';
import { notify } from '../notify';

const q = '[app]';

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
      dispatch(appsSuccess(fetch.toMap(res.data, 'name', { loaded: false })));
    } catch (e) {
      console.error(e);
      dispatch(appsFailure(e));
      dispatch(notify('error', `Failed to get apps`));
    }
    done();
  },
});

export const APP_WATCHER = `${q}/APP_WATCHER`;
export const APP_REQUEST = `${q}/APP_REQUEST`;
export const APP_SUCCESS = `${q}/APP_SUCCESS`;
export const APP_ABORTED = `${q}/APP_ABORTED`;
export const APP_FAILURE = `${q}/APP_FAILURE`;

export const appWatcher = name => ({ type: APP_WATCHER, name });
export const appRequest = name => ({ type: APP_REQUEST, name });
export const appSuccess = app => ({ type: APP_SUCCESS, app });
export const appAborted = () => ({ type: APP_ABORTED });
export const appFailure = error => ({ type: APP_FAILURE, error });

export const appLogic = createLogic({
  type: APP_REQUEST,
  cancelType: APP_ABORTED,
  latest: true,

  async process({ action }, dispatch, done) {
    try {
      const res = await fetch.get(`/api/v1/apps/${action.name}/stages`);
      dispatch(appSuccess(res.data));
    } catch (e) {
      console.error(e);
      dispatch(appFailure(e));
      dispatch(notify('error', `Failed to get app "${action.name}"`));
    }
    done();
  },
});

export const appWatcherLogic = createLogic({
  type: APP_WATCHER,
  cancelType: APP_ABORTED,
  latest: true,

  async process({ action, cancelled$ }, dispatch, done) {
    dispatch(appsRequest(action.name));

    const cancel = fetch.poller({
      interval: 3000,
      resource: `/apps/${action.name}/stages`,
      onError: err => {
        console.error(err);
        dispatch(appFailure(err));
        dispatch(notify('error', `Failed to get app "${action.name}"`));
      },
      onRefresh: data => {
        dispatch(appSuccess(data));
      },
    });
    cancelled$.subscribe(() => {
      cancel();
      done();
    });
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
      const url = `/api/v1/release`;
      await fetch.post(url, {
        app: action.app,
        stage: action.stage,
        version: action.version,
      });
      dispatch(appReleaseSuccess());
      dispatch(appRequest(action.app));
      dispatch(
        notify('info', `Release started to version "${action.version}"`)
      );
    } catch (e) {
      console.error(e);
      dispatch(appReleaseFailure(e));
      dispatch(notify('error', `Failed to release build "${action.version}"`));
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
      const url = `/api/v1/promote`;
      await fetch.post(url, {
        app: action.app,
        stage: action.stage,
        version: action.version,
        to: action.to,
      });
      dispatch(appPromoteSuccess());
      dispatch(appRequest(action.app));
      dispatch(notify('info', `Release "${action.version}" promoted`));
    } catch (e) {
      console.error(e);
      dispatch(appPromoteFailure(e));
      dispatch(notify('error', `Failed to promote build "${action.version}"`));
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
      const url = `/api/v1/release`;
      await fetch.destroy(url, {
        app: action.app,
        stage: action.stage,
        version: action.version,
      });
      dispatch(appRemoveSuccess());
      dispatch(appRequest(action.app));
      dispatch(notify('info', `Release "${action.version}" removed`));
    } catch (e) {
      console.error(e);
      dispatch(appRemoveFailure(e));
      dispatch(notify('error', `Failed to remove build "${action.version}"`));
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
      dispatch(notify('error', `Failed to save app "${action.app.name}"`));
    }
    done();
  },
});

export const reducer = (state = { data: {}, notifications: [] }, action) => {
  switch (action.type) {
    // APP
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

    // APPS
    case APPS_SUCCESS:
      return { ...state, data: action.apps };

    default:
      return state;
  }
};

export const logic = [
  appsLogic,
  appLogic,
  appWatcherLogic,
  appReleaseLogic,
  appPromoteLogic,
  appRemoveLogic,
  appSaveLogic,
];
