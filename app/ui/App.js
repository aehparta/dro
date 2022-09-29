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
      view.currentIndex = view.count - 4;
      break;
    case Qt.Key_F8:
      view.currentIndex = view.count - 3;
      break;
    case Qt.Key_F9:
      view.currentIndex = view.count - 2;
      break;
    case Qt.Key_F10:
      view.currentIndex = view.count - 1;
      break;
  }
}
