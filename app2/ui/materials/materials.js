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
    select(id) {
      this.material = this.materials[id];
      this.$emit('select', id, this.material);
    },
  },
};
