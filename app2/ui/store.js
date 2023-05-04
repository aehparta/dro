import { socket } from './io.js';

export const store = Vue.reactive({
  config: {},
  ui: {
    navigation: [
      { id: 'dro', label: 'DRO', icon: 'tint' },
      { id: 'vision', label: 'Vision', icon: 'camera' },
      { id: 'config', label: 'Config', icon: 'cogs' },
    ],
    keyboard: {},
    view: { reverse: false },
  },
  projects: [],
  machines: [],
  tools: [],
  materials: [],
});

export const config = Vue.computed(() => store.config);
export const ui = Vue.computed(() => store.ui);
export const projects = Vue.computed(() => store.projects);
export const machines = Vue.computed(() => store.machines);
export const tools = Vue.computed(() => store.tools);
export const materials = Vue.computed(() => store.materials);
export const set_secret = (key, value) => {
  const secrets = {};
  _.set(secrets, key, value);
  socket.emit('secrets', secrets);
};

const watching = Object.keys(store).reduce((acc, value) => {
  acc[value] = { watch: Vue.computed(() => store[value]), save: true };
  return acc;
}, {});

/* listen to changes in store to emit save */
for (const [key, value] of Object.entries(watching)) {
  Vue.watch(
    value.watch,
    (v) => {
      value.save && console.log('save', key);
      value.save ? socket.emit('save', key, v) : (value.save = true);
    },
    { deep: true }
  );
}

socket.on('config', (config) => {
  watching.config.save = false;
  store.config = config || {};
});

socket.on('ui', (ui) => {
  watching.ui.save = false;
  if (!_.isEmpty(ui)) {
    store.ui = ui;
    if (!window.location.hash) {
      window.location.hash = '#' + ui.navigation[0].id;
    }
  }
});

socket.on('projects', (projects) => {
  watching.projects.save = false;
  store.projects = projects || [];
});

socket.on('machines', (machines) => {
  watching.machines.save = false;
  store.machines = machines || [];
});

socket.on('tools', (tools) => {
  watching.tools.save = false;
  store.tools = (tools || []).sort((a, b) => a.id.localeCompare(b.id));
});

socket.on('materials', (materials) => {
  watching.materials.save = false;
  store.materials = materials.map((material) => ({
    ...(materials.find((p) => p.id == material.parent) || {}),
    ...material,
  }));
});
