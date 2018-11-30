import { createLogic } from "redux-logic";

export const NOTIFY = "[notify]/NOTIFY";
export const CLOSE = "[notify]/CLOSE";

let id = 0;

export const notify = (level, message, actions) => ({
  type: NOTIFY,
  id: (id += 1),
  level,
  message,
  actions,
});

export const close = id => ({ type: CLOSE, id });

export const notifyLogic = createLogic({
  type: NOTIFY,

  async process({ action }, dispatch, done) {
    setTimeout(() => {
      dispatch(close(action.id));
      done();
    }, 10000);
  },
});

export const reducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case NOTIFY:
      return {
        ...state,
        data: [
          {
            id: action.id,
            level: action.level,
            message: action.message,
            actions: action.actions || [],
          },
          ...state.data,
        ],
      };
    case CLOSE:
      return {
        ...state,
        data: state.data.filter(msg => msg.id !== action.id),
      };
    default:
      return state;
  }
};

export const logic = [notifyLogic];
