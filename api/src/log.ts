const LEVEL = parseInt(process.env.LOG_LEVEL || "1", 10);

export function debug(...msg: any[]) {
  if (LEVEL >= 0) {
    console.log.apply(null, ["[DEBU]", new Date().toISOString()].concat(msg));
  }
}

export function info(...msg: any[]) {
  if (LEVEL <= 1) {
    console.log.apply(null, ["[INFO]", new Date().toISOString()].concat(msg));
  }
}

export function warn(...msg: any[]) {
  if (LEVEL <= 2) {
    console.log.apply(null, ["[WARN]", new Date().toISOString()].concat(msg));
  }
}

export function error(...msg: any[]) {
  if (LEVEL <= 3) {
    console.log.apply(null, ["[ERRO]", new Date().toISOString()].concat(msg));
  }
}

export function exception(msg: string, error: Error) {
  if (LEVEL <= 3) {
    console.log("[ERRO]", new Date().toISOString(), msg, error);
  }
}
