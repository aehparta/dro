import { machine, offset, decimals } from '../../projects/store.js';

export default {
  template: '#tmpl-dro-offset-info',
  data() {
    return {
      machine,
      offset,
      decimals,
    };
  },
  methods: {
    isSet(type, id) {
      return this.offset?.[id + '_' + type] !== undefined;
    },
    value(type, id) {
      return (this.offset?.[id + '_' + type] || 0).toFixed(this.decimals);
    },
  },
};
