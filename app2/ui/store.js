import { socket } from './io.js';

export const store = Vue.reactive({
  encoders: {},
  machines: {},
  ui: {
    navigation: [{ id: 'dro', label: 'DRO' }],
    keyboard: {},
    view: { reverse: false },
  },
  tools: {},
  materials: {},
  projects: {},
});

const save = {
  encoders: true,
  machines: true,
  ui: true,
};

socket.on('encoders', (encoders) => {
  save.encoders = false;
  store.encoders = encoders;
});

socket.on('machines', (machines) => {
  save.machines = false;
  store.machines = machines;
});

socket.on('ui', (ui) => {
  save.ui = false;
  store.ui = ui;
  if (!window.location.hash) {
    window.location.hash = '#' + ui.navigation[0].id;
  }
});

socket.on('tools', (tools) => {
  store.tools = tools;
});

socket.on('materials', (materials) => {
  store.materials = {};
  for (const [name, material] of Object.entries(materials)) {
    store.materials[name] = {
      ...(material?.parent ? materials[material.parent] : {}),
      ...material,
    };
  }
});

socket.on('projects', (projects) => {
  store.projects = projects;
});

export const encoders = Vue.computed(() => store.encoders);
export const machines = Vue.computed(() => store.machines);
export const ui = Vue.computed(() => store.ui);
export const tools = Vue.computed(() => store.tools);
export const materials = Vue.computed(() => store.materials);
export const projects = Vue.computed(() => store.projects);

export default {
  data() {
    return {
      encoders,
      machines,
      ui,
      tools,
      materials,
      projects,
    };
  },
  watch: {
    ui: {
      handler: (v) => {
        save.ui ? socket.emit('save', 'ui', v) : (save.ui = true);
      },
      deep: true,
    },
  },
};
