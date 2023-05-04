import { ui } from './store.js';

export const page = Vue.ref(window.location.hash.substring(1)?.split('/')?.[0]);
export const route = Vue.ref(
  window.location.hash.substring(1)?.split('/') || []
);

export default {
  template: '#tmpl-header',
  data() {
    return {
      page,
      ui,
    };
  },
  created() {
    /* simple router using hash */
    addEventListener('hashchange', this.reHash);
    on('navigation', (event) => this.go(event.page));
    this.reHash();
  },
  methods: {
    go(action) {
      window.location.hash = '#' + action;
    },
    reHash() {
      if (window.location.hash.length > 0) {
        route.value = window.location.hash.substring(1)?.split('/') || [];
        page.value = route.value?.[0];
      } else {
        this.go('dro');
      }
    },
  },
};
