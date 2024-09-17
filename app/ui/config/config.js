import Backup from './backup.js';
import { route } from '../header.js';

export default {
  template: '#tmpl-config-config',
  components: {
    Backup,
  },
  data() {
    return {
      route,
    };
  },
  created() {},
  methods: {
    go(action) {
      window.location.hash = '#config/' + action;
    },
  },
};
