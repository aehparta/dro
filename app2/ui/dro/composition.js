import { machine, tool } from '../projects/store.js';
import Parameters from './parameters/parameters.js';
import OffsetInfo from './offset/info.js';

export default {
  template: '#tmpl-dro-composition',
  components: { Parameters, OffsetInfo },
  data() {
    return {
      machine,
      tool,
    };
  },
};
