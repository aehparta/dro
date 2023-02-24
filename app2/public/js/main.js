const socket = io();
const app = Vue.createApp({
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
        if (this.focus && this.action(this.page, 'change') === false) {
          return;
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
            offset,
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
          return true;
        case 'global':
          return this.action_global(action, ...rest);
        case 'dro':
          return this.action_dro(action, ...rest);
      }

      console.warn(`Unknown action: ${page}, ${action}`);
      return false;
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
      return true;
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
          let offset = this.axes[axis].offset;
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
          const input = this.$refs[axis][0].value;
          try {
            const vars = Object.entries(this.axes).reduce((acc, [id, data]) => {
              acc[id] = data.value - data.offset;
              return acc;
            }, {});
            const value = Number(calc(input, vars));
            let offset = this.axes[axis].offset;
            offset += this.axes[axis].value - offset - value;
            socket.emit('offset', {
              machine: this.machine_id,
              axis,
              offset,
            });
          } catch (error) {
            console.warn(error);
            this.$toast.error('Failed calculating new value');
            this.axes[axis].rounded = input;
            this.$refs[axis][0].focus();
            return false;
          }
          break;
      }

      return true;
    },
  },
});

app.use(VueToast.ToastPlugin);
app.mount('body');
