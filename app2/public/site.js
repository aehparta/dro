const socket = io();

socket.on('encoder', (id, channel, value) => {
  console.log(id, channel, value);
});
