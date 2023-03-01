import Materials from '../materials/materials.js';
import Material from '../materials/material.js';

export default {
  template: '#tmpl-config-config',
  components: {
    Materials,
    Material,
  },
  data() {
    return {
      material: undefined,
    };
  },
  created() {},
  methods: {
    selectMaterial(material) {
      this.material = material;
    },
  },
};
