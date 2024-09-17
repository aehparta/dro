import { tools } from '../../store.js';
import { tool, by_machine } from '../../projects/store.js';

const by_tool = (key, value) => {
  key = key instanceof Array ? key : key.split('.');
  key.unshift(tool.value?.id);
  key.unshift('by_tool');
  return by_machine(key, value);
};

export const insert = Vue.computed({
  get: () => tools.value.find((v) => v.id === by_tool('insert')),
  set: (value) => by_tool('insert', value?.id || value),
});

export const d = Vue.computed({
  get: () => by_tool('d') || tool.value?.d || 0,
  set: (value) => by_tool('d', value),
});
