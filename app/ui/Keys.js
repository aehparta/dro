function dro(event) {
  console.log('dro keys')
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
