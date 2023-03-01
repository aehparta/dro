import Navigation, { page } from './navigation.js';
import DRO from './dro/dro.js';
import { ui } from './store.js';

const templates = [
  'app.html',
  'navigation.html',
  'dro/dro.html',
  'dro/axis.html',
];

const app = Vue.createApp({
  template: '#tmpl-app',
  components: {
    Navigation,
    DRO,
  },
  data() {
    return {
      page: page,
      focus: false,
      ui,
    };
  },
  created() {
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
          this.action(page.value, 'change');
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
      console.log('keydown', key);

      if (key in this.ui.keyboard) {
        const shortcut = this.ui.keyboard[key];
        if (shortcut.propagate !== true) {
          event.stopPropagation();
          event.preventDefault();
        }
      }
    });

    addEventListener('keyup', (event) => {
      const key =
        (event.ctrlKey ? 'ctrl+' : '') +
        (event.altKey ? 'alt+' : '') +
        (event.shiftKey ? 'shift+' : '') +
        event.key;
      console.log('keyup', key);

      if (key in this.ui.keyboard) {
        const shortcut = this.ui.keyboard[key];
        if (shortcut.propagate !== true) {
          event.stopPropagation();
          event.preventDefault();
        }
        // this.action(...shortcut.action);
        emit(shortcut.action, shortcut);
      }
    });
  },
  methods: {
    action(page, action, ...rest) {
      switch (page) {
        case 'navigation':
          // navigation.methods.go(action);
          break;
        case 'global':
          this.action_global(action, ...rest);
          break;
        case 'dro':
          // dro.methods.action(action, ...rest);
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
  },
});

const promises = templates.map(async (template) => {
  const response = await fetch(`ui/${template}`);
  const data = await response.text();
  const tmpl = document.createElement('script');
  tmpl.type = 'text/x-template';
  tmpl.id = `tmpl-${template.replace('.html', '').replace('/', '-')}`;
  tmpl.innerHTML = data;
  document.body.append(tmpl);
});

Promise.all(promises).then(() => {
  app.mount('#app');
});
