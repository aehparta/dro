function dro(event) {
  switch (event.key) {
    case Qt.Key_X:
      axisEdit(x);
      break;
    case Qt.Key_Y:
      axisEdit(y);
      break;
    case Qt.Key_Z:
      axisEdit(z);
      break;
    case Qt.Key_A:
      axisEdit(a);
      break;
    case Qt.Key_B:
      axisEdit(b);
      break;
  }
}

function axis(event) {
  switch (event.key) {
    case Qt.Key_Delete:
      editor.text = '';
      break;
    case Qt.Key_Return:
    case Qt.Key_Enter:
      offset = value - (eval(editor.text) || '0') * 1000;
      mode = 'view';
      break;
    case Qt.Key_Escape:
      editor.focus = false;
      mode = 'view';
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
