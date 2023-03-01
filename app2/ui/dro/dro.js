import { machines } from '../store.js';
import { socket } from '../io.js';
import Axis from './axis.js';

export default {
  template: '#tmpl-dro-dro',
  components: { Axis },
  data() {
    return {
      machine_id: 'milling_machine',
      axes: {},
      focus: false,
      decimals: 3,
      machines,
    };
  },
  created() {
  },
  methods: {
    action(action, axis) {
      axis = axis || (this.focus && this.focus.id);
      if (!axis || !this.axes[axis]) {
        console.warn('axis not set or is invalid');
        return;
      }

      switch (action) {
        case 'zero':
          socket.emit('offset', {
            machine: this.machine_id,
            axis,
            offset: this.axes[axis].value,
          });
          break;
        case 'half': {
          let offset = this.machines[this.machine_id].axes[axis].offset || 0;
          offset += (this.axes[axis].value - offset) / 2;
          socket.emit('offset', {
            machine: this.machine_id,
            axis,
            offset,
          });
          break;
        }
        case 'select':
          this.focus = { axis };
          this.$refs[axis][0].focus();
          break;
        case 'change':
          const value = Number(
            eval(this.$refs[axis][0].value) /* note: using eval() on purpose */
          );
          let offset = this.machines[this.machine_id].axes[axis].offset || 0;
          offset += this.axes[axis].value - offset - value;
          socket.emit('offset', {
            machine: this.machine_id,
            axis,
            offset,
          });
          break;
      }
    },
  },
};
