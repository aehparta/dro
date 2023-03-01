import { machines } from '../store.js';
import Axis from './axis.js';
import Materials from '../materials/materials.js';
import Material from '../materials/material.js';

export default {
  template: '#tmpl-dro-dro',
  components: { Axis, Materials, Material },
  data() {
    return {
      machine_id: 'milling_machine',
      machines,
      decimals: 3,
      material: undefined,
      show: 'axes',
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
      this.show = 'axes';
    },
    selectMaterial(material) {
      this.material = material;
      this.show = 'axes';
    },
  },
};
