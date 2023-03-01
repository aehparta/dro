import { ui } from './store.js';

export const page = Vue.ref(window.location.hash.substring(1));

export default {
  template: '#tmpl-navigation',
  data() {
    return {
      ui,
    };
  },
  created() {
    /* simple router using url hash */
    addEventListener('hashchange', () => {
      page.value = window.location.hash.substring(1);
    });
    on('navigation', (event) => this.go(event.page));
  },
  methods: {
    go(action) {
      window.location.hash = '#' + action;
    },
  },
};
