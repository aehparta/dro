import { machines } from '../store.js';
import Machine from './machine.js';

export default {
  template: '#tmpl-machines-machines',
  components: { Machine },
  data() {
    return { machines };
  },
  methods: {
    select(id) {
      this.$emit('select', id);
    },
  },
};
