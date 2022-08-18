let x_zero = 0;
let y_zero = 0;

const keyPressed = (event) => {
  console.log('key pressed');
  if (event.key == Qt.Key_Left) {
    console.log('move left');
    event.accepted = true;
  }
};

const update = (ctx) => {
  var w = ctx.canvas.canvasSize.width;
  var h = ctx.canvas.canvasSize.height;

  ctx.reset();
  ctx.translate(w / 2, h / 2);
  ctx.strokeStyle = Qt.rgba(0, 1, 1, 0.5);
  ctx.lineWidth = 2.0;

  ctx.arc(x_zero, y_zero, 20, 0, 2 * Math.PI, false);

  ctx.moveTo(x_zero - 5, y_zero);
  ctx.lineTo(-w / 2, y_zero);

  ctx.moveTo(x_zero + 5, y_zero);
  ctx.lineTo(w / 2, y_zero);

  ctx.moveTo(x_zero, y_zero - 5);
  ctx.lineTo(x_zero, -h / 2);

  ctx.moveTo(x_zero, y_zero + 5);
  ctx.lineTo(x_zero, h / 2);

  ctx.stroke();
};
