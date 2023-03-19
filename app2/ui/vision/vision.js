import { socket } from '../io.js';

export default {
  template: '#tmpl-vision-vision',
  data() {
    return {
      w: undefined,
      h: undefined,
      camera_id: undefined,
      cameras: [],
    };
  },
  mounted() {
    if (this.camera_id) {
      this.open(this.camera_id);
    }

    socket.on('cameras', (data) => {
      if (!_.isEqual(this.cameras, data)) {
        this.cameras = data;
      }
    });

    window.addEventListener('resize', this.update);
    this.update();
  },
  unmounted() {
    socket.off('cameras');
    socket.off(`camera-${this.camera_id}`);
    socket.emit('camera_unsubscribe', this.camera_id);
    window.removeEventListener('resize', this.update);
  },
  watch: {
    camera_id(new_id, old_id) {
      this.open(new_id, old_id);
    },
  },
  methods: {
    open(new_id, old_id) {
      if (old_id) {
        socket.off(`camera-${old_id}`);
        socket.emit('camera_unsubscribe', old_id);
      }
      console.log('open', new_id);
      socket.on(`camera-${new_id}`, ({ image }) => {
        const buffer_to_base64 = (buffer) => {
          var binary = '';
          var bytes = new Uint8Array(buffer);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          return window.btoa(binary);
        };
        this.$refs.video.src =
          'data:image/jpeg;base64, ' + buffer_to_base64(image);
      });
      socket.emit('camera_subscribe', new_id);
    },
    update() {
      const header = document.getElementById('header');
      this.w = window.innerWidth;
      this.h = window.innerHeight - header.offsetHeight;

      this.$refs.container.style.top = header.offsetHeight + 'px';
      this.$refs.container.style.height = this.h + 'px';
      this.$refs.canvas.width = this.w;
      this.$refs.canvas.height = this.h;

      this.updateHud();
    },
    updateHud() {
      const ctx = this.$refs.canvas.getContext('2d');

      const off_x = this.w / 2;
      const off_y = this.h / 2;
      const crosshair_cap = 5;
      const crosshair_size = 200;
      const crosshair_radius = 50;

      ctx.clearRect(0, 0, this.w, this.h);
      ctx.save();

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = crosshair_radius;
      ctx.beginPath();
      ctx.arc(off_x, off_y, crosshair_radius, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(off_x - crosshair_cap, off_y);
      ctx.lineTo(off_x - crosshair_size, off_y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(off_x + crosshair_cap, off_y);
      ctx.lineTo(off_x + crosshair_size, off_y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(off_x, off_y - crosshair_cap);
      ctx.lineTo(off_x, off_y - crosshair_size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(off_x, off_y + crosshair_cap);
      ctx.lineTo(off_x, off_y + crosshair_size);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(off_x, off_y, crosshair_radius, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.restore();
    },
  },
};
