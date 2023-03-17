import { tools } from '../store.js';
import ToolsGrid from './tools-grid.js';

export default {
  template: '#tmpl-tools-tools',
  components: { ToolsGrid },
  props: {
    selected: Object,
    type: String,
    filter: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      tools,
      groups: [],
    };
  },
  created() {
    this.toolsChanged();
  },
  watch: {
    tools: () => this.toolsChanged(),
  },
  methods: {
    toolsChanged() {
      /* get groups that have more than single tool in them */
      this.groups = Object.entries(
        tools.value.reduce(
          (o, t) => (o = { ...o, [t.type]: o?.[t.type] + 1 || 1 }),
          {}
        )
      ).reduce((a, v) => (v[1] <= 1 ? a : a.push(v[0]) && a), []);
    },
  },
};
