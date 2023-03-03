import { machines, ui } from '../store.js';
import Materials from '../materials/materials.js';
import Material from '../materials/material.js';
import Sidebar from '../sidebar/sidebar.js';
import Axis from './axis.js';
import Offset from './offset.js';

export default {
  template: '#tmpl-dro-dro',
  components: { Axis, Materials, Material, Sidebar, Offset },
  data() {
    return {
      project: undefined,
      machine_id: undefined,
      machines,
      ui,
      decimals: 3,
      material_id: undefined,
      material: undefined,
      show: 'default',
      offsets: [
        { id: 'G54' },
        { id: 'G55' },
        { id: 'G56' },
        { id: 'G57' },
        { id: 'G58' },
        { id: 'G59' },
      ],
    };
  },
  created() {
    this.selectDefault(this.machines);
  },
  mounted() {
    on('cancel', this.cancel);
  },
  unmounted() {
    off('cancel', this.cancel);
  },
  watch: {
    machines(machines) {
      this.selectDefault(machines);
    },
  },
  methods: {
    cancel() {
      this.show = 'default';
    },
    selectMaterial(id, material) {
      this.material_id = id;
      this.material = material;
      this.show = 'default';
    },
    selectDefault(machines, from) {
      const keys = Object.keys(machines);
      if (!this.machine_id && keys.length > 0) {
        this.machine_id = keys[0];
      }
    },
  },
};
