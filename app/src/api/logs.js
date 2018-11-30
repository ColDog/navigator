import { createLogic } from "redux-logic";
import * as fetch from "./fetch";
import { notify } from "../notify";

const q = "[logs]";

export const LOGS_WATCHER = `${q}/LOGS_WATCHER`;
export const LOGS_REQUEST = `${q}/LOGS_REQUEST`;
export const LOGS_SUCCESS = `${q}/LOGS_SUCCESS`;
export const LOGS_ABORTED = `${q}/LOGS_ABORTED`;
export const LOGS_FAILURE = `${q}/LOGS_FAILURE`;

export const logsWatcher = releaseId => ({ type: LOGS_WATCHER, releaseId });
export const logsRequest = releaseId => ({ type: LOGS_REQUEST, releaseId });
export const logsSuccess = (releaseId, logs) => ({
  type: LOGS_SUCCESS,
  releaseId,
  logs,
});
export const logsAborted = () => ({ type: LOGS_ABORTED });
export const logsFailure = error => ({ type: LOGS_FAILURE, error });

export const logsLogic = createLogic({
  type: LOGS_REQUEST,
  cancelType: LOGS_ABORTED,
  latest: true,
  warnTimeout: 0,

  async process({ action }, dispatch, done) {
    try {
      const url = `/api/v1/logs/${action.releaseId}`;
      const res = await fetch.get(url);
      dispatch(logsSuccess(action.releaseId, res.data));
    } catch (e) {
      console.error(e);
      dispatch(logsFailure(e));
      dispatch(notify("error", `Failed to get logs`));
    }
    done();
  },
});

export const logsWatcherLogic = createLogic({
  type: LOGS_WATCHER,
  cancelType: LOGS_ABORTED,
  latest: true,

  async process({ action, cancelled$ }, dispatch, done) {
    const cancel = fetch.poller({
      interval: 3000,
      resource: `logs/${action.releaseId}`,
      onError: err => {
        console.error(err);
        dispatch(logsFailure(err));
        dispatch(notify("error", `Failed to get logs`));
      },
      onRefresh: data => {
        dispatch(logsSuccess(action.releaseId, data));
      },
    });
    cancelled$.subscribe(() => {
      cancel();
      done();
    });
  },
});

export const reducer = (state = { data: {}, error: null }, action) => {
  switch (action.type) {
    case LOGS_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          [action.releaseId]: action.logs,
        },
      };

    default:
      return state;
  }
};

export const logic = [logsLogic, logsWatcherLogic];
