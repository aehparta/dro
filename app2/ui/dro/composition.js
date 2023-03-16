import { machine, tool } from '../projects/store.js';
import Parameters from './parameters/parameters.js';
import OffsetInfo from './offset/info.js';
import Tool from '../tools/tool.js';
import Tools from '../tools/tools.js';

export default {
  template: '#tmpl-dro-composition',
  components: { Parameters, OffsetInfo, Tool, Tools },
  data() {
    return {
      machine,
      tool,
    };
  },
};
