import { socket } from '../io.js';

export default {
  props: {
    machine_id: String,
    id: String,
    label: String,
    offset: Number,
    decimals: Number,
  },
  data() {
    return {
      value: NaN,
      rounded: NaN,
      fixed: NaN,
      focused: false,
    };
  },
  created() {
    socket.on(`encoder.${this.machine_id}.${this.id}`, (value) => {
      if (this.focused) {
        return;
      }
      this.value = value;
      this.rounded = _.round(this.value - this.offset, this.decimals);
      this.fixed = this.rounded.toFixed(this.decimals);
    });
    on(['dro', 'select', this.id], () => this.$refs.input.focus());
    on('accept', () => this.$refs.input.blur());
    on('cancel', () => {
      this.focused = false;
      this.$refs.input.blur();
    });
  },
  methods: {
    focus() {
      this.focused = true;
    },
    blur() {
      if (this.focused) {
        
      }
      this.focused = false;
    },
  },
  template: '#tmpl-dro-axis',
};
