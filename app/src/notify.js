export const NOTIFY = '[notify]/NOTIFY';
export const CLOSE = '[notify]/CLOSE';

export const notify = (level, message) => ({ type: NOTIFY, level, message });
export const close = id => ({ type: CLOSE, id });

let id = 0;

export const reducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case NOTIFY:
      id++;
      return {
        ...state,
        data: [
          { id, level: action.level, message: action.message },
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
