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
      material_id: undefined,
      material: undefined,
    };
  },
  created() {},
  methods: {
    selectMaterial(id, material) {
      this.material_id = id;
      this.material = material;
    },
  },
};
