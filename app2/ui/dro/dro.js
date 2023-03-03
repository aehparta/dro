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
      machine_id: 'milling_machine',
      machines,
      ui,
      decimals: 3,
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
  mounted() {
    on('cancel', this.cancel);
  },
  unmounted() {
    off('cancel', this.cancel);
  },
  methods: {
    cancel() {
      this.show = 'default';
    },
    selectMaterial(material) {
      this.material = material;
      this.show = 'default';
    },
  },
};
