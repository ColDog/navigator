import { createLogic } from 'redux-logic';
import * as fetch from './fetch';

const q = '[logs]';

export const LOGS_REQUEST = `${q}/LOGS_REQUEST`;
export const LOGS_SUCCESS = `${q}/LOGS_SUCCESS`;
export const LOGS_ABORTED = `${q}/LOGS_ABORTED`;
export const LOGS_FAILURE = `${q}/LOGS_FAILURE`;

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

  async process({ action }, dispatch, done) {
    try {
      const url = `/api/v1/logs/${action.releaseId}`;
      const res = await fetch.get(url);
      dispatch(logsSuccess(action.releaseId, res.data));
    } catch (e) {
      console.error(e);
      dispatch(logsFailure(e));
    }
    done();
  },
});

export const reducer = (state = { data: {}, error: null }, action) => {
  switch (action.type) {
    // LOGS
    case LOGS_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          [action.releaseId]: action.logs,
        },
      };
    case LOGS_ABORTED:
      return { ...state, error: 'ABORTED' };
    case LOGS_FAILURE:
      return { ...state, error: action.error };

    default:
      return state;
  }
};

export const logic = [logsLogic];
