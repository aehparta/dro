import { tools } from '../store.js';
import Tool from './tool.js';

export default {
  template: '#tmpl-tools-tools-grid',
  components: { Tool },
  props: {
    group: String,
    selected: Object,
    filter: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      tools,
    };
  },
};
