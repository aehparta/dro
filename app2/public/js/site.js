const socket = io();
const { createApp } = Vue;

createApp({
  data() {
    return {
      x: 0.001,
      y: 0.002,
      z: 0.003,
    };
  },
  created() {
    socket.on(
      'encoder',
      ({ id, channel, value }) => (this[channel] = Number(value).toFixed(3))
    );
  },
}).mount('#app');
