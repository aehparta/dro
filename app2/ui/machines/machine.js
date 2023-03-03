export default {
  template: '#tmpl-machines-machine',
  props: {
    id: String,
    type: String,
  },
  methods: {
    iconColor() {
      switch (this.type) {
        case 'milling machine':
          return '#f0c000';
        case 'lathe':
          return '#ff0000';
        case 'router':
          return '#7b5c00';
      }
      return undefined;
    },
  },
};
