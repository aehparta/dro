const socket = io();
const { createApp } = Vue;

createApp({
  data() {
    return {
      page: window.location.hash.substring(1),
      config: {
        encoders: [],
        machines: [],
        ui: { navigation: [{ id: 'dro', label: 'DRO' }], keyboard: {} },
      },
      machine_id: 'milling_machine',
      axes: {},
    };
  },
  created() {
    /* simple router using url hash */
    addEventListener('hashchange', (event) => {
      this.page = window.location.hash.substring(1);
    });

    addEventListener('keydown', (event) => {
      if (event.key != 'F5') {
        event.stopPropagation();
        event.preventDefault();
      }
    });

    addEventListener('keyup', (event) => {
      event.stopPropagation();
      event.preventDefault();

      const key =
        (event.ctrlKey ? 'ctrl+' : '') +
        (event.altKey ? 'alt+' : '') +
        (event.shiftKey ? 'shift+' : '') +
        event.key;
      if (key in this.config.ui.keyboard) {
        [group, action] = this.config.ui.keyboard[key]
          .split(',')
          .map((s) => s.trim());
        this.action(group, action);
      }
    });

    socket.on('config', (config) => {
      this.config = config;
      this.axes = {};
      if (!window.location.hash) {
        window.location.hash = '#' + config.ui.navigation[0].id;
      }
    });

    socket.on('encoder', ({ id, axis, value }) => {
      if (id == this.machine_id) {
        value = Number(value).toFixed(3);
        this.axes = {
          ...this.axes,
          [axis]: value,
        };
      }
    });
  },
  methods: {
    action(group, action) {
      switch (group) {
        case 'navigation':
          window.location.hash = '#' + action;
          break;
        case 'global':
          this.action_global(action);
          break;
      }
    },
    action_global(action) {
      switch (action) {
        case 'fullscreen-toggle':
          document.fullscreenElement
            ? document.exitFullscreen()
            : document.documentElement.requestFullscreen();
          break;
      }
    },
  },
}).mount('body');
