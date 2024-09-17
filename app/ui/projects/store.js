import { projects, materials, machines, tools } from '../store.js';

const project_id = Vue.ref(localStorage.getItem('project_id'));
export const project = Vue.computed({
  get: () => projects.value.find((v) => v.id === project_id.value),
  set(value) {
    project_id.value = value?.id || value;
    localStorage.setItem('project_id', project_id.value);
  },
});

export const decimals = Vue.computed({
  get: () =>
    project.value?.decimals === undefined ? 3 : project.value?.decimals,
  set: (value) => (project.value.decimals = value),
});

export const material = Vue.computed({
  get: () => materials.value.find((v) => v.id === project.value?.material_id),
  set: (value) => (project.value.material_id = value?.id || value),
});

export const machine = Vue.computed({
  get: () => machines.value.find((v) => v.id === project.value?.machine_id),
  set: (value) => (project.value.machine_id = value?.id || value),
});

export const by_machine = (key, value) => {
  key = key instanceof Array ? key : key.split('.');
  key.unshift(machine.value?.id);
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
  get: () => {
    const o = {
      G54: { unset: true },
      G55: { unset: true },
      G56: { unset: true },
      G57: { unset: true },
      G58: { unset: true },
      G59: { unset: true },
      ..._.cloneDeep(by_machine('offsets.work')),
    };
    const tool_offsets = Object.entries(
      by_machine(['offsets', 'tool', tool.value?.id]) || {}
    );

    for (const offset_id of Object.keys(o)) {
      for (const axis_id of Object.keys(o[offset_id])) {
        const value = _.get(o, [offset_id, axis_id]);
        _.set(o, [offset_id, `${axis_id}_work`], value);
      }
    }

    for (const [axis_id, tool_offset_value] of tool_offsets) {
      for (const offset_id of Object.keys(o)) {
        const value = _.get(o, [offset_id, axis_id], 0);
        _.set(o, [offset_id, axis_id], value + tool_offset_value);
        _.set(o, [offset_id, `${axis_id}_tool`], tool_offset_value);
      }
    }

    if (!by_machine('offset_id')) {
      by_machine('offset_id', 'G54');
    }

    return o;
  },
});

export const offset = Vue.computed({
  get: () =>
    Object.entries(offsets.value).find(
      ([k]) => k === by_machine('offset_id')
    )?.[1],
  set: (data) => {
    if (data instanceof Array) {
      const [axis_id, value] = data;
      const offset_id = by_machine('offset_id');
      const tool_offset_value =
        by_machine(['offsets', 'tool', tool.value?.id, axis_id]) || 0;
      const path = ['offsets', 'work', offset_id, axis_id];
      by_machine(path, value - tool_offset_value);
    } else {
      by_machine('offset_id', data);
    }
  },
});
