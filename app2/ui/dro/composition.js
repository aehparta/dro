import { material, machine, tool } from '../projects/store.js';
import OffsetInfo from './offset/info.js';
import Tool from '../tools/tool.js';

export default {
  template: '#tmpl-dro-composition',
  components: { OffsetInfo, Tool },
  data() {
    return {
      material,
      machine,
      tool,
      d: 0,
      ap: 0,
      ap_range: undefined,
      vc: 0,
      vc_range: undefined,
      fn: 0,
      fn_range: undefined,
      rpm: 0,
    };
  },
  created() {
    this.setValues();
  },
  watch: {
    material() {
      this.setValues();
    },
    tool() {
      this.setValues();
    },
  },
  methods: {
    setValues() {
      const m_id = material.value?.id;
      const m_parent = material.value?.parent;
      const values =
        tool.value?.materials[`${m_parent} - ${m_id}`] ||
        tool.value?.materials[m_parent] ||
        {};

      this.d = tool.value?.d || 0;

      this.ap = values?.ap || undefined;
      this.vc = values?.vc || 0;
      this.fn = values?.fn || 0;
      this.rpm = (1000.0 * this.vc) / (Math.PI * this.tool?.d) || 0;

      this.ap_range = values?.ap_range;
      this.vc_range = values?.vc_range;
      this.fn_range = values?.fn_range;
    },
  },
};
