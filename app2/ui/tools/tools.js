import { tools } from '../store.js';
import ToolsGrid from './tools-grid.js';

export default {
  template: '#tmpl-tools-tools',
  props: {
    selected: Object,
    type: String,
    view: String,
    filter: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      tools,
      groups: [],
      components: {
        list: undefined,
        grid: ToolsGrid,
      },
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
      )
        .reduce((a, v) => (v[1] <= 1 ? a : a.push(v[0]) && a), [])
        .sort((a, b) => (a === 'insert' ? 1 : a.localeCompare(b)));
      /* groups with single tool in them are all placed under 'other' */
      this.groups.splice(-1, 0, 'other');
    },
  },
};
