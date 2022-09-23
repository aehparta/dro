function dro(event) {
  console.log('dro', event.key);
  switch (event.key) {
    case Qt.Key_X:
      axis_value_x.zero();
      break;
    case Qt.Key_Y:
      axis_value_y.zero();
      break;
    case Qt.Key_Z:
      axis_value_z.zero();
      break;
  }
}

function main(event) {
  console.log('main', event.key);
  switch (event.key) {
    case Qt.Key_F10:
      view.currentIndex = 1;
      break;
    case Qt.Key_F9:
      view.currentIndex = 0;
      break;
  }
}
