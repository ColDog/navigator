import * as fetch from './fetch';
import { notify } from '../notify';

export const start = store => {
  let last = new Date();
  setInterval(async () => {
    const events = await fetch.get(`/api/v1/events`);

    for (let event of events.data) {
      const cur = Date.parse(event.created);
      if (cur > last) {
        handle(event, store.dispatch);
        last = cur;
      }
    }

    Date.parse();
  }, 5000);
};

export const handle = (event, dispatch) => {
  switch (event.name) {
    case 'releases.created':
      dispatch(
        notify('info', `Release started to version "${event.payload.version}"`)
      );
      break;
    case 'releases.updated':
      dispatch(
        notify(
          'info',
          `Release to version "${event.payload.version}" updated to status "${
            event.payload.status
          }"`
        )
      );
      break;
  }
};
