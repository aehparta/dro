const events_listeners = {};

const emit = (signal, ...args) => {
  for (key in events_listeners) {
    if (
      key === `${signal}` ||
      (key.endsWith('*') && `${signal}`.startsWith(key.slice(0, -1)))
    ) {
      for (callback of events_listeners[key]) {
        callback(...args);
      }
    }
  }
};

const on = (signal, callback) => {
  if (!events_listeners[signal]) {
    events_listeners[signal] = [];
  }
  events_listeners[signal].push(callback);
};

const off = (signal, callback) => {
  for (key in events_listeners) {
    if (key === `${signal}`) {
      events_listeners[key] = events_listeners[key].filter(
        (cb) => callback && callback !== cb
      );
    }
  }
};

const calc = (equation, ...vars) => {
  const env = vars
    .flatMap((o) =>
      Object.entries(o).map(([key, value]) => `const ${key} = ${value};`)
    )
    .join(' ');
  equation = equation.replace(',', '.'); /* hack */
  return eval?.(`${env} with (Math) (${equation})`);
};
