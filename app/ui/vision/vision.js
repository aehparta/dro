import { socket } from '../io.js';
import { ui } from '../store.js';
import { page } from '../header.js';

export default {
  template: '#tmpl-vision-vision',
  data() {
    return {
      w: undefined,
      h: undefined,
      camera_id: undefined,
      cameras: [],
      ui,
      page,
    };
  },
  mounted() {
    socket.on('cameras', (data) => {
      if (!_.isEqual(this.cameras, data) && _.isArray(data)) {
        this.cameras = data
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((v, i) => {
            v.shortcut = Object.entries(this.ui.keyboard).find(
              ([_, data]) => data?.['vision.select.camera']?.index === i
            )?.[0];
            return v;
          });
      }
    });
  },
  unmounted() {
    socket.off('cameras');
  },
  watch: {
    camera_id(new_id, old_id) {
      this.open(new_id, old_id);
    },
    page(page) {
      page === 'vision' ? this.view() : this.hide();
    },
  },
  methods: {
    view() {
      on('vision.select.camera', ({ index }) => {
        if (this.cameras[index]) {
          this.camera_id = this.cameras[index].id;
        }
      });
      this.open(this.camera_id);
      this.update();
      window.addEventListener('resize', this.update);
    },
    hide() {
      off('vision.select.camera');
      this.open(undefined, this.camera_id);
      window.removeEventListener('resize', this.update);
    },
    open(new_id, old_id) {
      if (new_id === old_id) {
        return;
      }

      if (old_id) {
        socket.off(`camera-${old_id}`);
        socket.emit('camera_unsubscribe', old_id);
      }

      if (new_id) {
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
          this.updateHud();
        });
        socket.emit('camera_subscribe', new_id);
      }
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
      const vw = this.$refs.video.width;
      const vh = this.$refs.video.height;
      const ctx = this.$refs.canvas.getContext('2d');

      const off_x = this.w / 2;
      const off_y = this.h / 2;
      const ch_cap = 5;
      const ch_x = vw / 2 - ch_cap * 2;
      const ch_y = vh / 2 - ch_cap * 2;

      ctx.clearRect(0, 0, this.w, this.h);
      ctx.save();

      ctx.strokeStyle = 'rgba(0, 0, 255, 0.7)';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(off_x - ch_cap, off_y);
      ctx.lineTo(off_x - ch_x, off_y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(off_x + ch_cap, off_y);
      ctx.lineTo(off_x + ch_x, off_y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(off_x, off_y - ch_cap);
      ctx.lineTo(off_x, off_y - ch_y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(off_x, off_y + ch_cap);
      ctx.lineTo(off_x, off_y + ch_y);
      ctx.stroke();

      ctx.restore();
    },
  },
};
