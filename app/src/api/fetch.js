export const toMap = (data, param, extra) => {
  const map = {};
  data.forEach(obj => {
    map[obj[param]] = Object.assign(obj, extra);
  });
  return map;
};

export const request = async (method, url, body) => {
  console.log('req', method, url, body);
  const req = { method };
  if (body) {
    req.body = JSON.stringify(body);
    req.headers = { 'content-type': 'application/json' };
  }
  const res = await fetch(url, req);
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`invalid request ${res.status}`);
  }
  if (res.status !== 201) {
    const data = await res.json();
    return data;
  }
  return null;
};

export const get = url => request('GET', url, null);
export const post = (url, body) => request('POST', url, body);
export const destroy = (url, body) => request('DELETE', url, body);

export const poller = (interval, cb) => {
  let latest = null;
  const id = setInterval(async () => {
    const res = await get('/api/v1/poll');
    if (res.latest === latest) {
      return;
    }

    latest = res.latest;
    cb();
  }, interval);
  return () => {
    clearInterval(id);
  };
};
