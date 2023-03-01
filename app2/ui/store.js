import { socket } from './io.js';

const store = Vue.reactive({
  config: {
    encoders: [],
    machines: [],
    ui: { navigation: [{ id: 'dro', label: 'DRO' }], keyboard: {} },
  },
  tools: [],
  materials: [],
});

socket.on('config', (config) => {
  store.config = config;
  if (!window.location.hash) {
    window.location.hash = '#' + config.ui.navigation[0].id;
  }
});

socket.on('tools', (tools) => {
  store.tools = tools;
});

socket.on('materials', (materials) => {
  store.materials = materials;
});

export const config = Vue.computed(() => store.config);
export const machines = Vue.computed(() => store.config.machines);
export const ui = Vue.computed(() => store.config.ui);
export const tools = Vue.computed(() => store.tools);
export const materials = Vue.computed(() => store.materials);
