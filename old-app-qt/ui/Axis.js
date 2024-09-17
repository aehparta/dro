
function keypress(event) {
  switch (event.key) {
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

function keypress_editor(event) {
  switch (event.key) {
    case Qt.Key_Delete:
      editor.text = '';
      event.accepted = true;
      break;
  }
}
