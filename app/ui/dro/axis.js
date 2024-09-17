import { socket } from '../io.js';
import { decimals } from '../projects/store.js';

export default {
  template: '#tmpl-dro-axis',
  props: {
    machine_id: String,
    id: String,
    label: String,
    offset: Number,
  },
  data() {
    return {
      value: NaN,
      rounded: NaN,
      fixed: NaN,
      focused: false,
      decimals,
    };
  },
  mounted() {
    socket.on(`encoder.${this.machine_id}.${this.id}`, this.setValue);
    on(`dro.select.${this.id}`, () => this.$refs.input.focus());
    on('dro.zero', this.zero);
    on('dro.half', this.half);
    on('cancel', this.cancel);
  },
  unmounted() {
    socket.off(`encoder.${this.machine_id}.${this.id}`, this.setValue);
    off(`dro.select.${this.id}`);
    off('dro.zero', this.zero);
    off('dro.half', this.half);
    off('cancel', this.cancel);
  },
  methods: {
    setValue(value) {
      if (this.focused) {
        return;
      }
      this.value = value;
      this.rounded = _.round(this.value - this.offset, this.decimals);
      this.fixed = this.rounded.toFixed(this.decimals);
    },
    cancel() {
      this.focused = false;
    },
    focus() {
      this.focused = true;
    },
    blur() {
      if (this.focused) {
        const input = this.$refs.input.value;
        try {
          const vars = {};
          const value = Number(calc(input, vars));
          const offset = this.offset + (this.value - this.offset - value);
          this.$emit('offset', offset);
        } catch (error) {
          console.warn(error);
          this.$toast.error('Failed calculating new value');
          this.rounded = input;
          this.$refs.input.focus();
          return;
        }
      }
      this.focused = false;
    },
    zero() {
      if (this.focused) {
        this.$refs.input.value = '0';
        this.$refs.input.blur();
      }
    },
    half() {
      if (this.focused) {
        this.$refs.input.value = `${this.value - this.offset} / 2`;
        this.$refs.input.blur();
      }
    },
  },
};
