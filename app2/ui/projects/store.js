import { projects, materials, machines, tools } from '../store.js';

const project_id = Vue.ref(localStorage.getItem('project_id'));
export const project = Vue.computed({
  get: () => projects.value.find((v) => v.id === project_id.value),
  set(value) {
    project_id.value = value?.id || value;
    localStorage.setItem('project_id', project_id.value);
  },
});

export const material = Vue.computed({
  get: () => materials.value.find((v) => v.id === project.value?.material_id),
  set: (value) => (project.value.material_id = value?.id || value),
});

export const machine = Vue.computed({
  get: () => machines.value.find((v) => v.id === project.value?.machine_id),
  set: (value) => (project.value.machine_id = value?.id || value),
});

const by_machine = (key, value) => {
  key = key instanceof Array ? key : key.split('.');
  key.unshift(machine.value.id);
  key.unshift('by_machine');
  return value === undefined
    ? _.get(project.value, key)
    : _.set(project.value, key, value);
};

export const tool = Vue.computed({
  get: () => tools.value.find((v) => v.id === by_machine('tool_id')),
  set: (value) => by_machine('tool_id', value?.id || value),
});

export const offsets = Vue.computed({
  get: () =>
    _.merge(
      {
        G54: {},
        G55: {},
        G56: {},
        G57: {},
        G58: {},
        G59: {},
      },
      by_machine('offsets.default'),
      by_machine(['offsets', 'tool', tool.value.id])
    ),
});

export const offset = Vue.computed({
  get: () =>
    Object.entries(offsets.value).find(
      ([k]) => k === by_machine('offset_id')
    )?.[1],
  set: (data) => {
    if (data instanceof Array) {
      const [axis_id, value] = data;
      const group = machine.value.axes[axis_id]?.offset_group || 'default';

      const path = ['offsets', group];
      if (group === 'tool') {
        path.push(tool.value.id);
      }
      path.push(by_machine('offset_id'));
      path.push(axis_id);

      by_machine(path, value);
    } else {
      by_machine('offset_id', data);
    }
  },
});
