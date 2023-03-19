import { socket } from '../io.js';

export default {
  template: '#tmpl-vision-vision',
  mounted() {
    socket.on('camera', ({ id, image }) => {
      const tob64 = (buffer) => {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
      };
      // const b64 = btoa(String.fromCharCode.apply(null, new Uint8Array(image)));
      const b64 = tob64(image);
      this.$refs.video.src = 'data:image/jpeg;base64, ' + b64;
    });
    // if (Hls.isSupported()) {
    //   var hls = new Hls();
    //   // bind them together
    //   hls.attachMedia(this.$refs.video);
    //   hls.on(Hls.Events.MEDIA_ATTACHED, function () {
    //     console.log('video and hls.js are now bound together !');
    //     hls.loadSource('video0.m3u8');
    //     hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {});
    //   });
    // }

    // console.log(this.$refs.video.canPlayType('application/vnd.apple.mpegurl'))
    // this.$refs.video.src = 'video0.m3u8';

    // if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //   navigator.mediaDevices
    //     .getUserMedia({ video: true })
    //     .then((stream) => {
    //       this.$refs.video.srcObject = stream;
    //       this.$refs.video.play();
    //     });
    // }
  },
};
