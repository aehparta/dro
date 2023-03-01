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
