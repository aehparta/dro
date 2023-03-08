export default {
  template: '#tmpl-dialog-dialog',
  props: {
    title: String,
  },
  data() {
    return {
      show: false,
    };
  },
  mounted() {
    on('cancel', this.close);
  },
  unmounted() {
    off('cancel', this.close);
  },
  methods: {
    open() {
      this.show = true;
    },
    close() {
      this.show = false;
    },
  },
};
