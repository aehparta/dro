function keys(event) {
  switch (event.key) {
    case Qt.Key_X:
      axisMode(0, 'edit');
      break;
    case Qt.Key_Y:
      axisMode(1, 'edit');
      break;
    case Qt.Key_Z:
      axisMode(2, 'edit');
      break;
    case Qt.Key_A:
      axisMode(3, 'edit');
      break;
    case Qt.Key_B:
      axisMode(4, 'edit');
      break;
  }
}
