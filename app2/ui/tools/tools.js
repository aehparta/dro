import { tools } from '../store.js';
import Tool from './tool.js';

export default {
  template: '#tmpl-tools-tools',
  components: { Tool },
  data() {
    return {
      tools,
    };
  },
};
