import { materials } from '../store.js';

export default {
  template: '#tmpl-materials-materials',
  components: {},
  data() {
    return {
      materials,
      material: undefined,
    };
  },
  created() {},
  methods: {
    select(material) {
      this.material = material;
      this.$emit('select', material);
    },
  },
};
