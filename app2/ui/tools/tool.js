export default {
  template: '#tmpl-tools-tool',
  props: {
    id: String,
    type: String,
    d: Number,
    model: String,
    use: String,
    manufacturer: String,
  },
  methods: {
    iconColor() {
      switch (this.type) {
        case 'end mill':
          return '#0000ff';
        case 'face mill':
          return '#00ffff';
        case 'fly cutter':
          return '#00ff00';
        case 'boring head':
          return '#ffff00';
        case 'insert':
          return '#ff0000';
      }
      return undefined;
    },
  },
};
