import { socket } from './io.js';
import Navigation, { page } from './navigation.js';
import DRO from './dro/dro.js';
import Config from './config/config.js';
import { ui } from './store.js';
import Icon from './icon.js';
import Dialog from './dialog/dialog.js';

const app = Vue.createApp({
  template: '#tmpl-app',
  components: {
    Navigation,
    DRO,
    Config,
  },
  data() {
    return {
      page,
      ui,
      focus: { group: undefined, element: undefined },
    };
  },
  created() {
    addEventListener('keydown', this.keyPress);
    addEventListener('keyup', this.keyPress);

    on('fullscreen', () => {
      document.fullscreenElement
        ? document.exitFullscreen()
        : document.documentElement.requestFullscreen();
    });

    on('accept', () => {
      if (document.activeElement) {
        document.activeElement.blur();
      }
      if (document.body.classList.contains('focusing')) {
        this.focus.element?.tagName === 'INPUT'
          ? this.focus.element?.focus() + this.focus.element?.select()
          : this.focus.element?.click();
      }
    });

    on('view.reverse', () => {
      this.ui.view.reverse = !this.ui.view.reverse;
    });

    on('focusable.group', ({ dir }) => this.focusTravel(dir));
    on('focusable', ({ dir }) => this.focusTravel(dir));
    addEventListener('focusin', this.focusClear);
    on('cancel', () => {
      this.focusClear();
      if (document.activeElement) {
        document.activeElement.blur();
      }
    });

    socket.on('reload', (file) => {
      if (file.endsWith('.css')) {
        for (const element of document.head.children) {
          if (
            element?.attributes?.href?.value?.startsWith('css/site.all.css')
          ) {
            element.attributes.href.value = 'css/site.all.css';
            break;
          }
        }
      } else {
        location.reload();
      }
    });
  },
  methods: {
    keyPress(event) {
      const key =
        (event.ctrlKey ? 'ctrl+' : '') +
        (event.altKey ? 'alt+' : '') +
        (event.shiftKey ? 'shift+' : '') +
        event.key;

      console.log(event.type, key);

      if (key in this.ui.keyboard) {
        for (const [name, data] of Object.entries(this.ui.keyboard[key])) {
          const propagateToInput =
            data?.whenEditing === false &&
            document.activeElement?.tagName === 'INPUT';
          /* conditionally stop event propagation */
          if (data?.propagate !== true && !propagateToInput) {
            event.stopPropagation();
            event.preventDefault();
          }
          /* conditionally emit */
          if (event.type === 'keydown' && !propagateToInput) {
            emit(name, data);
          }
        }
      }
    },
    focusTravel(dir) {
      const focusables = Array.from(
        (
          document.getElementById('dialog') || document.body
        ).getElementsByClassName('focusable')
      ).filter((el) => el.offsetParent);

      if (focusables.length < 1) {
        return;
      }

      this.focus.element?.classList.remove('focused');
      if (!this.focus.element?.offsetParent) {
        this.focus.element = focusables[0];
      } else if (document.body.classList.contains('focusing')) {
        const rc0 = this.focus.element.getBoundingClientRect();
        const i = focusables.indexOf(this.focus.element);

        let lx = dir === 'right' ? Infinity : -Infinity;
        let ly = Infinity;

        const elements = ['up', 'left'].includes(dir)
          ? [...focusables.slice(i), ...focusables.slice(0, i)].reverse()
          : [...focusables.slice(i + 1), ...focusables.slice(0, i + 1)];

        for (const element of elements) {
          const rc1 = element.getBoundingClientRect();
          const dx = rc1.x - rc0.x;
          const dy = Math.abs(rc1.y - rc0.y);

          if (['up', 'down'].includes(dir) && Math.abs(dx) < 10) {
            this.focus.element = element;
            break;
          } else if (dir === 'right' && dx > 10 && dx < lx && dy < ly) {
            this.focus.element = element;
            lx = dx + 10;
            ly = dy;
          } else if (dir === 'left' && dx < -10 && dx > lx && dy < ly) {
            this.focus.element = element;
            lx = dx - 10;
            ly = dy;
          }
        }
      }

      this.focus.element.classList.add('focused');
      document.body.classList.add('focusing');
    },
    focusClear() {
      document.body.classList.remove('focusing');
    },
  },
});

app.use(VueToast.ToastPlugin);
app.component('Icon', Icon);
app.component('Dialog', Dialog);
app.mount('#app');
