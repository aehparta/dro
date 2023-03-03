export default {
  template: '#tmpl-dro-offset',
  props: {
    id: String,
    selected: Boolean,
    x: Number,
    y: Number,
    z: Number,
    a: Number,
    b: Number,
    c: Number,
  },
  data() {
    return {
      active:
        this.x !== undefined ||
        this.y !== undefined ||
        this.z !== undefined ||
        this.a !== undefined ||
        this.b !== undefined ||
        this.c !== undefined,
    };
  },
};
