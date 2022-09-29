function dro(event) {
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

function cam(event) {
  console.log('cam keys');
  switch (event.key) {
  }
}

function common(event) {
  switch (event.key) {
    case Qt.Key_F2:
      window.visibility =
        window.visibility != Window.FullScreen
          ? Window.FullScreen
          : Window.AutomaticVisibility;
      break;
    case Qt.Key_F9:
      view.currentIndex = 0;
      break;
    case Qt.Key_F10:
      view.currentIndex = 1;
      break;
  }
}
