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
      focus: false,
      decimals: 3,
    };
  },
  created() {
    /* simple router using url hash */
    addEventListener('hashchange', () => {
      this.page = window.location.hash.substring(1);
    });

    addEventListener(
      'focusin',
      () => {
        const ref = Object.entries(this.$refs).find(([, el]) =>
          [el, el[0]].includes(document.activeElement)
        );
        if (ref) {
          this.focus = { id: ref[0] };
        }
      },
      true
    );

    addEventListener(
      'focusout',
      () => {
        console.log('lost focus to something', document.activeElement);
        if (this.focus) {
          this.action(this.page, 'change');
        }
        this.focus = false;
      },
      true
    );

    addEventListener('keydown', (event) => {
      const key =
        (event.ctrlKey ? 'ctrl+' : '') +
        (event.altKey ? 'alt+' : '') +
        (event.shiftKey ? 'shift+' : '') +
        event.key;
      if (key in this.config.ui.keyboard) {
        const shortcut = this.config.ui.keyboard[key];
        if (shortcut.editing === false && this.focus) {
          /* empty */
        } else if (
          ['global', 'navigation'].includes(shortcut.action[0]) ||
          this.page === shortcut.action[0]
        ) {
          if (shortcut.propagate !== true) {
            event.stopPropagation();
            event.preventDefault();
          }
        }
      }
    });

    addEventListener('keyup', (event) => {
      const key =
        (event.ctrlKey ? 'ctrl+' : '') +
        (event.altKey ? 'alt+' : '') +
        (event.shiftKey ? 'shift+' : '') +
        event.key;
      console.log(key);

      if (key in this.config.ui.keyboard) {
        const shortcut = this.config.ui.keyboard[key];
        if (shortcut.editing === false && this.focus) {
          /* empty */
        } else if (
          ['global', 'navigation'].includes(shortcut.action[0]) ||
          this.page === shortcut.action[0]
        ) {
          if (shortcut.propagate !== true) {
            event.stopPropagation();
            event.preventDefault();
          }
          this.action(...shortcut.action);
        }
      }
    });

    socket.on('config', (config) => {
      this.config = config;
      this.axes = {};
      if (!window.location.hash) {
        window.location.hash = '#' + config.ui.navigation[0].id;
      }
    });

    socket.on('encoder', ({ machine, axis, value }) => {
      if (!this.focus && machine == this.machine_id) {
        const offset =
          this.config.machines[this.machine_id].axes[axis].offset || 0;
        const rounded = _.round(value - offset, this.decimals);
        const fixed = rounded.toFixed(this.decimals);
        this.axes = {
          ...this.axes,
          [axis]: {
            ...this.axes[axis],
            value,
            rounded,
            fixed,
          },
        };
      }
    });
  },
  methods: {
    action(page, action, ...rest) {
      switch (page) {
        case 'navigation':
          window.location.hash = '#' + action;
          break;
        case 'global':
          this.action_global(action, ...rest);
          break;
        case 'dro':
          this.action_dro(action, ...rest);
          break;
        default:
          console.warn(`Unknown action: ${page}, ${action}`);
          break;
      }
    },
    action_global(action) {
      switch (action) {
        case 'cancel':
          this.focus = false;
        case 'accept':
          if (document.activeElement) {
            document.activeElement.blur();
          }
          break;
        case 'fullscreen-toggle':
          document.fullscreenElement
            ? document.exitFullscreen()
            : document.documentElement.requestFullscreen();
          break;
      }
    },
    action_dro(action, axis) {
      axis = axis || (this.focus && this.focus.id);
      if (!axis || !this.axes[axis]) {
        console.warn('axis not set or is invalid');
        return;
      }

      switch (action) {
        case 'zero':
          socket.emit('offset', {
            machine: this.machine_id,
            axis,
            offset: this.axes[axis].value,
          });
          break;
        case 'half': {
          let offset =
            this.config.machines[this.machine_id].axes[axis].offset || 0;
          offset += (this.axes[axis].value - offset) / 2;
          socket.emit('offset', {
            machine: this.machine_id,
            axis,
            offset,
          });
          break;
        }
        case 'select':
          this.focus = { axis };
          this.$refs[axis][0].focus();
          break;
        case 'change':
          const value = Number(
            eval(this.$refs[axis][0].value) /* note: using eval() on purpose */
          );
          let offset =
            this.config.machines[this.machine_id].axes[axis].offset || 0;
          offset += this.axes[axis].value - offset - value;
          socket.emit('offset', {
            machine: this.machine_id,
            axis,
            offset,
          });
          break;
      }
    },
  },
}).mount('body');
