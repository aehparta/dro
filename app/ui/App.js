function keys(event) {
  console.log('app keys');
  switch (event.key) {
    case Qt.Key_F2:
      window.visibility =
        window.visibility != Window.FullScreen
          ? Window.FullScreen
          : Window.AutomaticVisibility;
      break;
    case Qt.Key_F7:
      // viewName = '';
      break;
    case Qt.Key_F8:
      viewName = 'Config';
      break;
    case Qt.Key_F9:
      viewName = 'Cam';
      break;
    case Qt.Key_F10:
      viewName = 'DRO';
      break;
  }
}
