import { tools } from '../store.js';
import Tool from './tool.js';

export default {
  template: '#tmpl-tools-tools-grid',
  components: { Tool },
  props: {
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
