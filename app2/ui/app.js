import Navigation, { page } from './navigation.js';
import DRO from './dro/dro.js';
import Config from './config/config.js';
import Store, { ui } from './store.js';

const templates = [
  'app.html',
  'navigation.html',
  'dro/dro.html',
  'dro/axis.html',
  'dro/offset.html',
  'config/config.html',
  'materials/materials.html',
  'materials/material.html',
  'sidebar/sidebar.html',
];

const stylesheets = [
  'app.css',
  'navigation.css',
  'dro/dro.css',
  'dro/axis.css',
  'dro/offset.css',
  'materials/materials.css',
  'materials/material.css',
  'sidebar/sidebar.css',
];

const app = Vue.createApp({
  template: '#tmpl-app',
  components: {
    Navigation,
    DRO,
    Config,
    Store,
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
      if (this.focus.element) {
        this.focus.element.click();
      }
    });

    on('view.reverse', () => {
      this.ui.view.reverse = !this.ui.view.reverse;
    });

    on('focusable.group', ({ dir }) => {
      this.focusGroupSelect(dir);
      this.focusElementSelect(0);
    });
    on('focusable', ({ dir }) => {
      this.focusGroupSelect(0);
      this.focusElementSelect(dir);
    });
    addEventListener('focusin', this.focusClear);
    on('cancel', this.focusClear);
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
    focusGroupSelect(dir) {
      const groups = Array.from(
        document.body.getElementsByClassName('focusable-group')
      ).filter((el) => el.offsetParent);

      let index = 0;
      if (groups.includes(this.focus.group)) {
        index = groups.indexOf(this.focus.group) + dir;
        if (index >= groups.length) {
          index = 0;
        } else if (index < 0) {
          index = groups.length - 1;
        }
      }

      this.focus.group = groups[index];
    },
    focusElementSelect(dir) {
      const elements = Array.from(
        this.focus.group.getElementsByClassName('focusable')
      ).filter((el) => el.offsetParent);

      let index = 0;
      if (elements.includes(this.focus.element)) {
        index = elements.indexOf(this.focus.element) + dir;
        if (index >= elements.length) {
          index = 0;
        } else if (index < 0) {
          index = elements.length - 1;
        }
      }

      if (this.focus.element) {
        this.focus.element.classList.remove('focused');
      }
      this.focus.element = elements[index];
      this.focus.element.classList.add('focused');
    },
    focusClear() {
      if (this.focus.element) {
        this.focus.element.classList.remove('focused');
      }
      this.focus.element = undefined;

      this.ui.other = Math.random();
    },
  },
});

for (const stylesheet of stylesheets) {
  const el = document.createElement('link');
  el.rel = 'stylesheet';
  el.href = `ui/${stylesheet}`;
  document.head.append(el);
}

const promises = templates.map(async (template) => {
  const response = await fetch(`ui/${template}`);
  const data = await response.text();
  const el = document.createElement('script');
  el.type = 'text/x-template';
  el.id = `tmpl-${template.replace('.html', '').replace('/', '-')}`;
  el.innerHTML = data;
  document.body.append(el);
});

Promise.all(promises).then(() => {
  app.use(VueToast.ToastPlugin);
  app.mount('#app');
});
